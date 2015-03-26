var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var config = require('../config');
var pool = require('./daonPool').pool;

exports.save = function(obj, callback) {
	pool.acquire(function(err, db) {
		if (err) {
			throw err;
		} else {
			var topicsDAO = db.collection('topics');
			// if (obj._id) { //更新

			// } else { //新增,能够自动生成_id.
			topicsDAO.save(obj, function(err, result) {
				if (err) {
					throw err;
				}

				callback(result)
			});
			// }
		}
	});

};