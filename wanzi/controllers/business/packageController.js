/**
 * 礼包管理.
 */
var fs = require('fs');
var path = require('path');
var sys = require('sys');
var config = require('../../config');

//工具类
var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;
var FlipQuery = require('zero').FlipQuery;
var extend = require('zero').extend;
var renderUtil = require('./util/renderUtil');

// DAO.
var daoPool = require('../../dao');
var packageDAO = daoPool.PackageDAO;
var packageCodeDAO = daoPool.PackageCodeDAO;

exports.list = function(req, res) {
	var query = req.body.query || {};
	var fq = new FlipQuery(query);
	var filter = new FlipFilter(req.body.filter);

	//query, filter, fields
	new packageDAO().flip(fq, filter, "title description yxq syl zl img", function(err, list) {
		if (err) {
			throw err;
		}
		var cons = {
			name: '礼包',
		};

		// extend(cons, rootCate);
		renderUtil.render(res, 'business/packageList', {
			title: cons.name + '管理',
			list: list,
			cons: cons,
			query: query,
			filter: filter.init()
		});
	});
}

exports.remove = function(req, res) {
	var id = req.query.id;
	if (id) {
		new packageDAO().shutById(id, function() {
			res.redirect('/business/package/list');
		})
	}
}

exports.edit = function(req, res) {
	var id = req.query['id'];
	var cons = {
		name: '礼包',
	};
	if (id) { // 修改
		new packageDAO().getById(id, function(err, obj) {
			if (err) {
				throw err;
			}
			renderUtil.render(res, 'business/packageEdit', {
				title: cons.name + '管理-修改' + '--' + obj.title,
				obj: obj,
				cons: cons,
			});
		});
	} else { // 添加
		renderUtil.render(res, 'business/packageEdit', {
			title: cons.name + '管理-添加',
			obj: {},
			cons: cons,
		});
	}

}

exports.editP = function(req, res) {
	var obj = req.body.obj;
	var file = req.files && req.files.img && req.files.img['img'];
	if (!file || !file.size) { // error:修改时仍然是新增.
		if (obj._id) {
			obj.modifyTime = Date.now();
			new packageDAO().update(obj._id, obj, function() {
				res.redirect('/business/package/list');
			});
			return;
		} else {
			new packageDAO().create(obj, function(e, f) {
				res.redirect('/business/package/list');
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

			obj.img = config.relative_img_dir + filename;
			obj.realpath = target_path;
			if (obj._id) {
				obj.modifyTime = Date.now();
				new packageDAO().update(obj._id, obj, function() {
					res.redirect('/business/package/list');
				});
				return;
			} else {
				new packageDAO().create(obj, function() {
					res.redirect('/business/package/list');
				});
				return;
			}
		});
	});
}

exports.detail = function(req, res) {
	var id = req.query['id'];
	new packageDAO().getById(id, function(err, obj) {
		if (err) {
			throw err;
		}
		var cons = {
			name: '礼包',
		};

		new packageCodeDAO().list({
			package_id: id
		}, "code inusing", function(err, list) {
			if (err) {
				throw err;
			}

			renderUtil.render(res, 'business/packageDetail', {
				title: cons.name + '管理-详情--' + obj.title,
				obj: obj,
				cons: cons,
				codes: list
			});
		});

	});
}

var readline = require('readline');

exports.parse = function(req, res) {
	var id = req.body.obj._id;
	var file = req.files.txtfile;
	if (!file || !file.size) {
		res.redirect('/business/package/detail?id=' + id);
		return;
	}

	var name = file.name;
	if (name.indexOf('.txt') == name.length - 4) {
		var rl = readline.createInterface({
			input: fs.createReadStream(file.path),
			output: process.stdout,
			terminal: false
		});

		var pcDAO = new packageCodeDAO();
		var total = 0;
		rl.on('line', function(line) {
			pcDAO.create({
				code: line,
				package_id: id
			});
			total++;
		}).on('close', function() {
			var pDAO = new packageDAO();
			pDAO.getById(id, function(err, obj) {
				if (err) {
					throw err;
				}

				pDAO.save({
					_id: id,
					zl: obj.zl + total,
					syl: obj.syl + total
				}, function(err, f) {})
			});
		});
		res.redirect('/business/package/detail?id=' + id);
		return;
	} else {
		res.redirect('/business/package/detail?id=' + id);
		return;
	}
}