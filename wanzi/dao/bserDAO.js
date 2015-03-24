var model = require('../model');
var Bser = model.Bser;

exports.getBserByName = function(name, callback) {
	Bser.findOne({
		'name' : name
	}, callback);
}

exports.getBserById = function(id, callback) {
	Bser.findOne({
		_id : id
	}, callback);
};

exports.newAndSave = function(name, aliasname, pass, callback) {
	var bser = new Bser();
	bser.name = name;
	bser.aliasname = aliasname;
	bser.pass = pass;
	bser.save(callback);
};