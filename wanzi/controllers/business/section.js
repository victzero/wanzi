var fs = require('fs');
var path = require('path');
var sys = require('sys');
var config = require('../../config');
var topicDAO = require('../../dao').TopicDAO;
var cateDAO = require('../../dao').CateDAO;
var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;
var extend = require('zero').extend;
var renderUtil = require('./util/renderUtil');

/**
 * 类别子项 列表 get & post
 */
exports.list = function(req, res, category) {
	cateDAO.getCateByPN(category, function(err, cate) { // 查找子项
		if (err) {
			throw err;
		}
		if (!cate) {
			res.redirect('/404');
			return;
		}
		var stitle = req.query['s_title'] || req.body['s_title'];
		var filter = new FlipFilter(req.body.filter);
		filter.category = category;
		if (stitle) {
			filter.title = stitle;
		}

		topicDAO.flip(filter, function(err, list) {
			if (err) {
				throw err;
			}

			var cons = {
				name: cate.title,
			};
			// extend(cons, rootCate);
			renderUtil.render(res, 'business/sectionList', {
				title: cons.name + '管理',
				list: list,
				s_title: stitle,
				category: category,
				cons: cons,
				filter: filter.init()
			});
		});
	});

}

exports.edit = function(req, res, category) {
	cateDAO.getCateByPN(category, function(err, cate) { // 查找子项
		if (err) {
			throw err;
		}
		if (!cate) {
			res.redirect('/404');
			return;
		}
		var id = req.query['id'];
		var cons = {
			name: cate.title,
		};
		// extend(cons, rootCate);
		if (id) { // 修改
			topicDAO.getTopicById(id, function(err, obj) {
				if (err) {
					throw err;
				}
				renderUtil.render(res,'business/sectionEdit', {
					title: cons.name + '管理-修改' + '--' + obj.title,
					topic: obj,
					cons: cons
				});
			});
		} else { // 添加
			renderUtil.render(res,'business/sectionEdit', {
				title: cons.name + '管理-添加',
				topic: {
					category: category
				},
				cons: cons
			});
		}
	});
}

exports.detail = function(req, res, category) {
	cateDAO.getCateByPN(category, function(err, cate) { // 查找子项
		if (err) {
			throw err;
		}
		if (!cate) {
			res.redirect('/404');
			return;
		}
		var id = req.query['id'];
		topicDAO.getTopicById(id, function(err, obj) {
			if (err) {
				throw err;
			}
			var cons = {
				name: cate.title,
			};
			// extend(cons, rootCate);
			renderUtil.render(res,'business/sectionDetail', {
				title: cons.name + '管理-详情--' + obj.title,
				topic: obj,
				cons: cons
			});
		});
	});
}

exports.remove = function(req, res, category) {
	var id = req.query['id'];
	if (id) {
		topicDAO.removeById(id, function(err, count) {
			res.redirect('/business/sectionList/' + category);
		});
	} else {
		res.redirect('/business/sectionList/' + category);
	}
}

exports.editP = function(req, res, category) {
	cateDAO.getCateByPN(category, function(err, cate) { // 验证category.
		if (err) {
			throw err;
		}
		if (!cate) {
			res.redirect('/404');
			return;
		}
		var topic = req.body.topic;
		topic.category = category;
		var file = req.files && req.files.img;
		if (!file || !file.size) { // error:修改时仍然是新增.
			if (topic._id) {
				topic.modifyTime = Date.now();
				topicDAO.update(topic._id, topic, function() {
					res.redirect('/business/sectionList/' + category);
				});
				return;
			} else {
				topicDAO.newAndSave(topic, function() {
					res.redirect('/business/sectionList/' + category);
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
						res.redirect('/business/sectionList/' + category);
					});
					return;
				} else {
					topicDAO.newAndSave(topic, function() {
						res.redirect('/business/sectionList/' + category);
					});
					return;
				}
			});
		});
	});
}