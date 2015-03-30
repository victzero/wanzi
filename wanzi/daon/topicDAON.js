var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var config = require('../config');
var pool = require('./daonPool').pool;
var ObjectID = mongodb.ObjectID;
var cateDAO = require('../dao/cateDAO')

exports.save = function(obj, callback) {
	pool.acquire(function(err, db) {
		if (err) {
			throw err;
		} else {
			var topicsDAO = db.collection('topics');
			topicsDAO.save(obj, function(err, result) {
				if (err) {
					throw err;
				}

				//文章数+1
				console.log(obj)
				cateDAO.updateNumTopic(obj.category, function() {
					callback(result)
				})
				// callback(result)

			});
		}
	});

};

exports.update = function(id, obj, callback) {
	pool.acquire(function(err, db) {
		if (err) {
			throw err;
		} else {
			var topicsDAO = db.collection('topics');

			delete obj._id;

			// topicsDAO.find({
			// 	_id: new ObjectID(id)
			// }).toArray(function(err, docs) {

			// 	if (err) throw err;

			// 	docs.forEach(function(doc) {
			// 		console.log(doc);
			// 	});

			// });

			topicsDAO.update({
				_id: new ObjectID(id)
			}, {
				$set: obj
			}, function(err, res) {
				if (err) {
					throw err;
				}
				callback();
			});
		}
	});
}