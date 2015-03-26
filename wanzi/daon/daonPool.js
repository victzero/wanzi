var mongodb = require("mongodb"),
    poolModule = require('generic-pool');
var config = require('../config');

exports.pool = poolModule.Pool({
    name: 'mongodb',
    create: function(callback) {
        mongodb.MongoClient.connect(config.db, {
            server: {
                poolSize: 1
            }
        }, function(err, db) {
            callback(err, db);
        });
    },
    destroy: function(db) {
        db.close();
    },
    max: 10, //根据应用的可能最高并发数设置
    idleTimeoutMillis: 30000,
    log: false
});