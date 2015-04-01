var model = require('../model');
var Bser = model.Bser;
var crypto = require('crypto');

exports.getBserByName = function(name, callback) {
	Bser.findOne({
		'name': name
	}, callback);
}

exports.getBserById = function(id, callback) {
	Bser.findOne({
		_id: id
	}, callback);
};

exports.newAndSave = function(temp, callback) {
	var bser = new Bser();
	bser.name = temp.name;
	bser.aliasname = temp.aliasname;
	if (temp.password) {
		bser.password = md5(temp.password);
	} else {
		bser.password = md5('123456'); //新用户默认密码为123456	
	}

	bser.save(callback);
};

exports.removeById = function(id, callback) {
	Bser.remove({
		_id: id
	}, callback);
}

exports.shutById = function(id, callback) {
	Bser.update({
		_id: id
	}, {
		inusing: false
	}, callback);
}

// 对cate进行分页.
exports.flip = function(filter, callback) {
	var options = {
		skip: (filter.pageNo - 1) * filter.pageSize,
		limit: filter.pageSize,
		sort: {
			modifyTime: -1
		}
	};
	var query = {
		inusing: true
	};
	if (filter.name) {
		var keyword = filter.name.replace(/[\*\^\&\(\)\[\]\+\?\\]/g, '');
		query.name = new RegExp(keyword, 'i');
	}

	Bser.count(query, function(err, count) {
		if (err) {
			throw err;
		}
		filter.totalCount = count;

		if (count != 0) {
			Bser.find(query, '_id name inusing aliasname modifyTime',
				options,
				function(err, docs) {
					if (err) {
						return callback(err);
					}
					if (docs.length === 0) {
						return callback(null, []);
					}
					return callback(null, docs);

				});
		} else {
			return callback(null, []);
		}
	});
}

exports.update = function(id, bser, callback) {
	delete bser._id;
	Bser.update({
		_id: id
	}, bser, callback);
}

function md5(str) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
}