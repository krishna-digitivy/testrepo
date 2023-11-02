const  mysql        = require('mysql');
const  config       = require('../config.json');

var params = {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port
}

const connection = mysql.createConnection(params)

module.exports = connection;