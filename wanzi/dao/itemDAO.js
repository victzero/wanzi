var model = require('../model');
var Item = model.Item;

exports.getItemByName = function(title, callback) {
	Item.findOne({
		'title' : title
	}, callback);
}

exports.getItemById = function(id, callback) {
	Item.findOne({
		_id : id
	}, callback);
};

exports.removeById = function(id, callback) {
	Item.remove({
		_id : id
	}, callback);
}

// 对item进行分页.
exports.flip = function(filter, callback) {
	var options = {
		skip : (filter.pageNo - 1) * filter.pageSize,
		limit : filter.pageSize,
		sort : {
			modifyTime : -1
		}
	};
	var query = {};
	if (filter.title) {
		var keyword = filter.title.replace(/[\*\^\&\(\)\[\]\+\?\\]/g, '');
		query.title = new RegExp(keyword, 'i');
	}
	query.category = filter.category;
	//查询列表信息.
	Item.find(query, '_id title status iterestRate duration amount modifyTime', options, function(err, docs) {
		if (err) {
			return callback(err);
		}
		if (docs.length === 0) {
			return callback(null, []);
		}
		return callback(null, docs);

	});
}

exports.newAndSave = function(temp, callback){
	var item = new Item();
	item.title = temp.title;
	item.status = temp.status;
	item.iterestRate = temp.iterestRate;
	item.duration = temp.duration;
	item.amount = temp.amount;
	item.save(callback);
};

exports.update = function(id, item, callback) {
	delete item._id;
	Item.update({
		_id : id
	}, item, callback);
}
