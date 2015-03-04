var fs = require('fs');
var path = require('path');
var config = require('../../config');
var topicDAO = require('../../dao').TopicDAO;
var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;

var cateName = '首页-滚动图';
var cateType = 'homeimg';

exports.index = function(req, res) {

	var filter = new FlipFilter(req.body.filter);
	filter.category = cateType;
	topicDAO.flip(filter, function(err, topics) {
		if (err) {
			throw err;
		}
		res.render('admin/index', {
			title : '欢迎来到科盛护栏控制台',
			topics : topics,
			fmt : fmt,
			filter : filter.init()
		});
	});

}

exports.edit = function(req, res) {
	var id = req.query['id'];
	if (id) {// 修改
		topicDAO.getTopicById(id, function(err, obj) {
			if (err) {
				throw err;
			}
			res.render('admin/homeimgEdit', {
				title : '首页-滚动条修改' + '--' + obj.title,
				topic : obj,
			});
		});
	} else {// 添加
		res.render('admin/homeimgEdit', {
			title : '首页-滚动条添加',
			topic : {
				category : cateType
			},
		});
	}
}

exports.detail = function(req, res) {
	var id = req.query['id'];
	topicDAO.getTopicById(id, function(err, obj) {
		if (err) {
			throw err;
		}
		res.render('admin/homeimgDetail', {
			title : '首页-滚动条管理-详情--' + obj.title,
			topic : obj,
		});
	});
}

exports.remove = function(req, res) {
	var id = req.query['id'];
	if (id) {
		topicDAO.removeById(id, function(err, count) {
			res.redirect('/admin');
		});
	} else {
		res.redirect('/admin');
	}
}

exports.editP = function(req, res) {
	var topic = req.body.topic;
	topic.category = cateType;
	var file = req.files && req.files.img;
	if (!file || !file.size) {// error:修改时仍然是新增.
		if (topic._id) {
			topic.modifyTime = Date.now();
			topicDAO.update(topic._id, topic, function() {
				res.redirect('/admin');
			});
			return;
		} else {
			topicDAO.newAndSave(topic, function() {
				res.redirect('/admin');
			});
			return;
		}
	}

	var tmp_path = file.path;
	var filename = Date.now() + '_' + file.name;

	var target_path = path.join(config.upload_img_dir, filename);

	fs.rename(tmp_path, target_path, function(err) {
		if (err) {
			throw err;
		}
		// 删除临时文件夹文件,
		fs.unlink(tmp_path, function() {
			if (err) {
				throw err;
			}

			topic.img = config.relative_img_dir + filename;
			topic.realpath = target_path;
			if (topic._id) {
				topic.modifyTime = Date.now();
				topicDAO.update(topic._id, topic, function() {
					res.redirect('/admin');
				});
				return;
			} else {
				topicDAO.newAndSave(topic, function() {
					res.redirect('/admin');
				});
				return;
			}
		});
	});

}