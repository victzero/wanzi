var model = require('../model');
var Topic = model.Topic;

exports.getTopicByName = function(title, callback) {
	Topic.findOne({
		'title' : title
	}, callback);
}

exports.getTopicById = function(id, callback) {
	Topic.findOne({
		_id : id
	}, callback);
};

exports.removeById = function(id, callback) {
	Topic.remove({
		_id : id
	}, callback);
}

// 对topic进行分页.
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
	Topic.find(query, '_id title category img imgalt modifyTime', options, function(err, docs) {
		if (err) {
			return callback(err);
		}
		if (docs.length === 0) {
			return callback(null, []);
		}
		return callback(null, docs);

	});
}

exports.newAndSave = function(temp, callback) {
	var topic = new Topic();
	topic.title = temp.title;
	topic.keyword = temp.keyword;
	topic.img = temp.img;
	topic.category = temp.category;
	topic.content = temp.content;
	topic.realpath = temp.realpath;
	topic.save(callback);
};

exports.update = function(id, topic, callback) {
	delete topic._id;
	Topic.update({
		_id : id
	}, topic, callback);
}
