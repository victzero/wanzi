var model = require('../model');
var User = model.User;
var zero = require('zero');

exports.getUserByName = function(name, callback) {
	User.findOne({
		'name': name
	}, callback);
}

exports.getUserById = function(id, callback) {
	User.findOne({
		_id: id
	}, callback);
};

exports.newAndSave = function(name, aliasname, pass, callback) {
	var user = new User();
	user.name = name;
	user.aliasname = aliasname;
	user.password = zero.util.md5(pass);
	user.save(callback);
};