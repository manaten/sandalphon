$(function() {
    var savedQueries = [];
    var getEntries = function(query) {
        $.post('/api/entry.get', {query:query}, function(data) {
            console.log("entry.get: ", data.entries);
            $('#feeds').empty().append(data.entries.map(function(entry) {
                return $('<tr><td><a href="'+entry.url+'">'+entry.title+'</a></td></tr>');
            }));
        });
    };
    var loadSavedQueries = function() {
        $.post('/api/query.get', {}, function(data) {
            savedQueries = data.queries;
            console.log(data.queries);
            $('#savedQuery').empty()
            .append('<li class="nav-header">saved query</li>')
            .append(data.queries.map(function(query) {
                return $('<li></li>').append('<a href="#">'+query.name+'</a>').on('click', function() {
                    $('#search').val(query.name);
                    getEntries(query);
                });
            }));
        });
    };
    var saveQuery = function(query) {
        queryObj = parseQuery(query);
        queryObj.name = query;
        savedQueries.push(queryObj);

        $.post('/api/query.save', {queries:savedQueries}, function(data) {
            loadSavedQueries();
        });
    };

    var parseQuery = function(rawQuery) {
        var r = {keywords:[], from:[]};
        var a = rawQuery.split(' ');
        a.forEach(function(q) {
            if (/https?:\/\/.*/.test(q)) {
                r.from.push(q);
            } else {
                r.keywords.push(q);
            }
        });
        return r;
    };
    $('#search').on('keypress', function() {
        getEntries(parseQuery($(this).val()));
    });
    $('#save').on('click', function() {
        saveQuery($('#search').val());
    });
    getEntries(parseQuery(''));
    loadSavedQueries();
});
