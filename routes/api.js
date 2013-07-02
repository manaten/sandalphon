var dbBase = require('../models/dbBase.js'),
    request = require('request');
// TODO
var get = {
    'bookmark.add': function(req, res) {
        var url = req.query.url ? req.query.url : "";
         request({uri:url}, function (error, response, body) {
            if (!error && response.statusCode == 200) {


                var title = body.match(/<title>([^<]*)<\/title>/)[1];
                var rss = body.match(/<link[^>]*type="application\/rss+xml"[^>]*href=([^>]*)[^>]*>/)[1];
//                    var rss = $('link');
                res.send({ok:"ok", url:url, title:title, rss:rss });
                res.end();

            } else {
                res.send(500, {error:"error", url:url});
                res.end();
            }
        });
    }
};

var post = {
    'test.dayo': function(req, res) {
        res.send({ok:"ok"});
        res.end();
    },

    'entry.get': function(req, res) {
        var query = req.body.query ? req.body.query : {};
        var keywords = query.keywords ? query.keywords : [];
        var from = query.from ? query.from : [];

        // fromをentry から引いてあれば追加。なければ登録 TODO:URLの正規化をしないとカオスになる恐れ
        var conn = dbBase.createConnection();
        var feedIds = [];
        var where = from.length > 0 ?
            "WHERE url IN (" + from.map(function(k) {return "'"+k+"'"}).join(', ') + ")"
            :'';
        conn.query('SELECT * FROM feed '+where+';', [])
            .on('result', function(feed) {
                feedIds.push(feed.id);
            })
            .on ('end', function() {
                conn.destroy();


                var where = keywords.length > 0 ?
                    "WHERE " + keywords.map(function(k) {return "(title LIKE '%"+k+"%' OR content LIKE '%"+k+"%')"}).join(' AND ')
                    :'';

                if (feedIds.length > 0) {
                    where = where !== "" ? where + " AND " : "WHERE ";
                    where += "feed_id IN ("+feedIds.join(",")+")";
                }

                conn = dbBase.createConnection();
                var entries = [];
                var sql = 'SELECT * FROM feed_entry '+where+' ORDER BY post_time DESC LIMIT 100;';
                console.log(sql);
                conn.query(sql, [])
                    .on('result', function(entry) {
                        entries.push(entry);
                    })
                    .on ('end', function() {
                        conn.destroy();

                        res.send({ok:"ok", entries:entries});
                        res.end();
                    });
            });


    },

    'query.get': function(req, res) {
        var conn = dbBase.createConnection();
        var queries = [];
        conn.query('SELECT * FROM saved_queries WHERE user_id=? LIMIT 100;', [1])
            .on('result', function(query) {
                queries.push(query);
            })
            .on ('end', function() {
                conn.destroy();
                var q = queries.length > 0 ? queries[0].queries : '[]';

                res.send({ok:"ok", queries: JSON.parse(q)});
                res.end();
            });
    },

    'query.save': function(req, res) {
        var queries = req.body.queries ? req.body.queries : [];
        console.log(queries);
        var conn = dbBase.createConnection();
        conn.query('UPDATE saved_queries SET queries=? WHERE user_id=?;', [JSON.stringify(queries), 1])
            .on ('end', function() {
                conn.destroy();
                res.send({ok:"ok"});
                res.end();
            });
    },

    'bookmark.get': function(req, res) {
        var query = req.body.query ? req.body.query : {};
        var keywords = query.keywords ? query.keywords : [];
        var from = query.from ? query.from : [];

        res.send({ok:"ok"});
        res.end();
    }
};

exports.get = function(req, res) {
    res.set('Content-Type', 'application/json');
    var apiName = req.params[0];
    if (get[apiName]) {
        get[apiName](req, res);
    } else {
        res.send(404, {error:"Not Found such API!"});
        res.end();
    }
};

exports.post = function(req, res) {
    res.set('Content-Type', 'application/json');
    var apiName = req.params[0];
    if (post[apiName]) {
        post[apiName](req, res);
    } else {
        res.send(404, {error:"Not Found such API!"});
        res.end();
    }
};
