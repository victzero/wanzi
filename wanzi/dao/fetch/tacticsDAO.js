var model = require('../../model');
var Tactics = model.Tactics;

exports.getTacticsById = function(id, callback) {
	Tactics.findOne({
		_id : id
	}, callback);
};

/**
 * 物理删除.
 */
exports.removeById = function(id, callback) {
	Tactics.remove({
		_id : id
	}, callback);
}

/**
 * 逻辑删除.
 */
exports.shutById = function(id, callback) {
	Tactics.update({
		_id : id
	}, {
		inusing : false
	}, callback);
}

// 对tactics进行分页.
exports.flip = function(filter, callback) {
	var options = {
		skip : (filter.pageNo - 1) * filter.pageSize,
		limit : filter.pageSize,
		sort : {
			modifyTime : -1
		}
	};
	var query = {
		inusing : true
	};
	if (filter.title) {
		var keyword = filter.title.replace(/[\*\^\&\(\)\[\]\+\?\\]/g, '');
		query.title = new RegExp(keyword, 'i');
	}

	Tactics.count(query, function(err, count) {
		if (err) {
			throw err;
		}
		filter.totalCount = count;

		if (count != 0) {
			Tactics.find(query, '_id title reg modifyTime',
					options, function(err, docs) {
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
	var tactics = new Tactics();
	tactics.title = temp.title;
	tactics.reg = temp.reg;
	tactics.save(callback);
};

exports.update = function(id, tactics, callback) {
	delete tactics._id;
	Tactics.update({
		_id : id
	}, tactics, callback);
}
