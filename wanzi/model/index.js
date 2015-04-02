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

console.info('start to use mongoose connect mongoDb.')
mongoose.connect(config.db, options, function(err) {
	if (err) {
		console.error('connect to %s error: ', config.db, err.message);
		process.exit(1);
	} else {
		console.info('mongoose connected.')
	}
});

require('./user');
require('./bser');
require('./vistor');
require('./topic');
require('./cate');
require('./item');
require('./fetch/tactics');
require('./constant');
require('./comment');

exports.User = mongoose.model('USER');
exports.Bser = mongoose.model('BSER');
exports.Vistor = mongoose.model('VISTOR');
exports.Topic = mongoose.model('TOPIC');
exports.Cate = mongoose.model('CATE');
exports.Item = mongoose.model('ITEM');
exports.Tactics = mongoose.model('TACTICS');
exports.Const = mongoose.model('CONSTANT');
exports.Comment = mongoose.model('COMMENT');