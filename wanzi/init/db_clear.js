/**
 * 清空数据
 */
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var config = require('../config');
var pool = require('../daon/daonPool').pool;
var ObjectID = mongodb.ObjectID;

/**
 *  清空 表
 * @type {Array}
 */
exports.clear = function(arr, next) {
	pool.acquire(function(err, db) {
		if (err) {
			throw err;
		} else {
			for (var i = 0; i < arr.length; i++) {
				var tab = arr[i];
				var coll = db.collection(tab);
				coll.drop(function(err) {
					if (err) {
						//ignore
					}

				});
			};
			next && next();
		}
	});

};