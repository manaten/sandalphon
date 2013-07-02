var feedparser = require('feedparser'),
    dbBase = require('../models/dbBase.js'),
    request = require('request')
    sha1 = require('sha1');

var conn = dbBase.createConnection();

conn.query('SELECT * FROM feed;', [])
    .on('result', function(feed) {
        request(feed.url).pipe(new feedparser([]))
        .on('error', function(error) {
        // always handle errors
        })
        .on('data', function (entry) {
            var token = sha1(feed.id+entry.title+entry.link+entry.date);
            console.log(entry.title);
            var conn = dbBase.createConnection();
            conn.query('INSERT INTO feed_entry (feed_id, entry_token, title, url, content, post_time) VALUES (?, ?, ?, ?, ?, ?);',
                    [feed.id, token, entry.title, entry.link, entry.description, entry.date])
                .on('error', function(error) {
                    if (error.code !== 'ER_DUP_ENTRY') {
                        console.log(error);
                    }
                 })
                .on('end', function() {
                    conn.destroy();
                });
        })
        .on('readable', function () {});
        })
    .on ('end', function() {
        conn.destroy();
    });

