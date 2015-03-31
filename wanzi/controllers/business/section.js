var fs = require('fs');
var path = require('path');
var sys = require('sys');
var config = require('../../config');
var topicDAO = require('../../dao').TopicDAO;
var topicDAON = require('../../daon/topicDAON');
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
				sortNum: cate.sortNum
			};
			// extend(cons, rootCate);
			renderUtil.render(res, 'business/sectionList', {
				title: cons.name + '管理',
				list: list,
				s_title: stitle,
				category: category,
				cate: cate,
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
				sortNum: cate.sortNum
		};
		// extend(cons, rootCate);
		if (id) { // 修改
			topicDAO.getTopicById(id, function(err, obj) {
				if (err) {
					throw err;
				}
				renderUtil.render(res, 'business/sectionEdit', {
					title: cons.name + '管理-修改' + '--' + obj.title,
					topic: obj,
					cons: cons,
					fields: cate.fields
				});
			});
		} else { // 添加
			renderUtil.render(res, 'business/sectionEdit', {
				title: cons.name + '管理-添加',
				topic: {
					category: category,
					get: function() {}
				},
				cons: cons,
				fields: cate.fields
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
				sortNum: cate.sortNum
			};
			// extend(cons, rootCate);
			renderUtil.render(res, 'business/sectionDetail', {
				title: cons.name + '管理-详情--' + obj.title,
				topic: obj,
				cons: cons,
				fields: cate.fields
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
		var imgs = req.files && req.files.img;

		var length = Object.keys(imgs).length;
		var upIndex = 0;
		var nothingIndex = 0;
		// console.log('上传文件数;' + length)
		if (length != 0) {
			for (var key in imgs) {
				img = imgs[key];
				if (!img || !img.size) { //该文件为空
					nothingIndex++;
				} else {
					saveFile(img, function(data) {
						topic[key] = data.img;
						topic[key + '_rp'] = data.realpath; //rp = realpath.
						upIndex++;
						// console.log('upIndex' + upIndex + ',length' + length)

						if (upIndex + nothingIndex == length) { //最后一个了.
							if (topic._id) { //修改
								// console.log('有文件修改')
								topic.modifyTime = Date.now();
								topicDAON.update(topic._id, topic, function() {
									res.redirect('/business/sectionList/' + category);
								});
								return;
							} else { //新增
								// console.log('有文件新增')
								delete topic._id;
								topicDAON.save(topic, function() {
									res.redirect('/business/sectionList/' + category);
								});
								return;
							}
						}
					});
				}
				if (nothingIndex == length) { //全都没有上传.
					//没有需要上传的文件.
					if (topic._id && topic._id != '') {
						// console.log('有文件都未上传修改')
						topic.modifyTime = Date.now();
						topicDAON.update(topic._id, topic, function() {
							res.redirect('/business/sectionList/' + category);
						});
						return;
					} else {
						// console.log('有文件都未上传新增')
						delete topic._id;
						topicDAON.save(topic, function() {
							res.redirect('/business/sectionList/' + category);
						});
						return;
					}
				}
			}
		} else {
			//没有需要上传的文件.
			if (topic._id && topic._id != '') {
				// console.log('无文件修改' + topic)
				topic.modifyTime = Date.now();
				topicDAON.update(topic._id, topic, function() {
					res.redirect('/business/sectionList/' + category);
				});
				return;
			} else {
				// console.log('无文件新增')
				delete topic._id;
				topicDAON.save(topic, function() {
					res.redirect('/business/sectionList/' + category);
				});
				return;
			}
		}
	});
}

function saveFile(file, callback) {
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

			var data = {
				img: config.relative_img_dir + filename,
				realpath: target_path
			}
			callback(data);

		});
	});
}