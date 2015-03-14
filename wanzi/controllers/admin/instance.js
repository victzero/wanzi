var fs = require('fs');
var path = require('path');
var config = require('../../config');
var topicDAO = require('../../dao').TopicDAO;
var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;

var constants = {
	type : {
		name : '普通新闻1',
		navID_list : '51',
		navID_edit : '52',
	},
	chanpin : {
		name : '普通新闻2',
		navID_list : '31',
		navID_edit : '32',
	},
	xinwen : {
		name : '普通新闻3',
		navID_list : '41',
		navID_edit : '42',
	}
}

exports.assertIns = function(cate) {
	if (typeof constants[cate] != 'undefined') {
		return true;
	}
	return false;
};

/**
 * 产品实例
 */
exports.list = function(req, res, category) {
	var stitle = req.query['s_title'] || req.body['s_title'];
	var filter = new FlipFilter(req.body.filter);
	filter.category = category;
	if (stitle) {
		filter.title = stitle;
	}
	topicDAO.flip(filter, function(err, topics) {
		if (err) {
			throw err;
		}
		var ins = constants[category];
		res.render('admin/instanceList', {
			title : ins.name + '管理',
			topics : topics,
			fmt : fmt,
			s_title : stitle,
			category : category,
			ins : ins,
			filter : filter.init()
		});
	});
}

exports.edit = function(req, res, category) {
	var id = req.query['id'];
	var ins = constants[category];
	if (id) {// 修改
		topicDAO.getTopicById(id, function(err, obj) {
			if (err) {
				throw err;
			}
			res.render('admin/instanceEdit', {
				title : ins.name + '管理-修改' + '--' + obj.title,
				topic : obj,
				ins : ins
			});
		});
	} else {// 添加
		res.render('admin/instanceEdit', {
			title : ins.name + '管理-添加',
			topic : {
				category : category
			},
			ins : ins
		});
	}
}

exports.detail = function(req, res, category) {
	var id = req.query['id'];
	topicDAO.getTopicById(id, function(err, obj) {
		if (err) {
			throw err;
		}
		var ins = constants[category];
		res.render('admin/instanceDetail', {
			title : ins.name + '管理-详情--' + obj.title,
			topic : obj,
			ins : ins
		});
	});
}

exports.remove = function(req, res, category) {
	var id = req.query['id'];
	if (id) {
		topicDAO.removeById(id, function(err, count) {
			res.redirect('/admin/instanceList/' + category);
		});
	} else {
		res.redirect('/admin/instanceList/' + category);
	}
}

exports.editP = function(req, res, category) {
	var topic = req.body.topic;
	topic.category = category;
	var file = req.files && req.files.img;
	if (!file || !file.size) {// error:修改时仍然是新增.
		if (topic._id) {
			topic.modifyTime = Date.now();
			topicDAO.update(topic._id, topic, function() {
				res.redirect('/admin/instanceList/' + category);
			});
			return;
		} else {
			topicDAO.newAndSave(topic, function() {
				res.redirect('/admin/instanceList/' + category);
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
					res.redirect('/admin/instanceList/' + category);
				});
				return;
			} else {
				topicDAO.newAndSave(topic, function() {
					res.redirect('/admin/instanceList/' + category);
				});
				return;
			}
		});
	});

}
