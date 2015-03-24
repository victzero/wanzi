var mongoose = require('mongoose');
var config = require('../config').config;

var options = {
	server: {
		poolSize: 5
	},
	auth: {
		user: config.dbUser,
		pass: config.dbPass
	}

}

mongoose.connect(config.db, options, function(err) {
	if (err) {
		console.error('connect to %s error: ', config.db, err.message);
		process.exit(1);
	}
});

require('./user');
require('./bser');
require('./topic');
require('./cate');
require('./item');
require('./fetch/tactics');

exports.User = mongoose.model('USER');
exports.Bser = mongoose.model('BSER');
exports.Topic = mongoose.model('TOPIC');
exports.Cate = mongoose.model('CATE');
exports.Item = mongoose.model('ITEM');
exports.Tactics = mongoose.model('TACTICS');