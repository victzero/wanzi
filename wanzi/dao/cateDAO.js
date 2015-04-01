var model = require('../model');
var Cate = model.Cate;

/**
 * 新建
 * @param  {[type]}   temp [description]
 * @param  {Function} cb   [description]
 * @return {[type]}        [description]
 */
exports.create = function(temp, cb) {
	var entity = new Cate(temp);
	entity.save(cb);
}

exports.getCateByPN = function(pathname, callback) {
	Cate.findOne({
		'pathname': pathname
	}, callback);
}

exports.updateNumTopic = function(pathname, callback) {
	Cate.findOne({
		'pathname': pathname
	}, function(err, cate) {
		if (err) {
			throw err;
		}

		cate.totalcount = cate.totalcount + 1;
		cate.save(callback)
	});
}

exports.getCateById = function(id, callback) {
	Cate.findOne({
		_id: id
	}, callback);
};

exports.removeById = function(id, callback) {
	Cate.remove({
		_id: id
	}, callback);
}

exports.shutById = function(id, callback) {
	Cate.update({
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
			sortNum: -1,
			modifyTime: -1
		}
	};
	var query = {
		inusing: true
	};
	if (filter.title) {
		var keyword = filter.title.replace(/[\*\^\&\(\)\[\]\+\?\\]/g, '');
		query.title = new RegExp(keyword, 'i');
	}
	query.category = filter.category;

	Cate.count(query, function(err, count) {
		if (err) {
			throw err;
		}
		filter.totalCount = count;

		if (count != 0) {
			Cate.find(query, '_id title pathname totalcount sortNum allowComment modifyTime',
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

exports.newAndSave = function(temp, callback) {
	var cate = new Cate();
	cate.title = temp.title;
	cate.pathname = temp.pathname;
	cate.keyword = temp.keyword;
	cate.sortNum = temp.sortNum;
	cate.save(callback);
};

exports.update = function(id, cate, callback) {
	delete cate._id;
	Cate.update({
		_id: id
	}, cate, callback);
}