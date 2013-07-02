var mysql = require('mysql');
/*
 * Base functions of connection DB.
 */
exports.createConnection = function() {
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'sandalphon',
    password : 'sandalphon',
    database : 'sandalphon'
  });
  connection.connect();
  return connection;
};
