var fs = require('fs');
var path = require('path');
var sys = require('sys');
var config = require('../../config');
var bserDAO = require('../../dao').BserDAO;
var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;
var extend = require('zero').extend;

var cons = {
	name: '商家用户管理',
	navID_list: '71',
	navID_edit: '72',
};

/**
 * 商家用户列表,get & post
 */
exports.list = function(req, res) {
	var filter = new FlipFilter(req.body.filter);
	bserDAO.flip(filter, function(err, bsers) {
		if (err) {
			throw err;
		}

		res.render('admin/bserList', {
			title: cons.name + '管理',
			list: bsers,
			fmt: fmt,
			cons: cons,
			filter: filter.init()
		});
	});
}

exports.edit = function(req, res) {
	var id = req.query['id'];
	if (id) { // 修改
		bserDAO.getCateById(id, function(err, obj) {
			if (err) {
				throw err;
			}
			res.render('admin/bserEdit', {
				title: cons.name + '管理-修改' + '--' + obj.title,
				obj: obj,
				cons: cons
			});
		});
	} else { // 添加
		res.render('admin/bserEdit', {
			title: cons.name + '管理-添加',
			obj: {},
			cons: cons
		});
	}
}

exports.remove = function(req, res) {
	var id = req.query['id'];
	if (id) {
		bserDAO.shutById(id, function(err, count) {
			res.redirect('/admin/bserList/');
		});
	} else {
		res.redirect('/admin/bserList/');
	}
}

exports.editP = function(req, res) {
	var bser = req.body.obj;

	if (bser._id) {
		bser.modifyTime = Date.now();
		bserDAO.update(bser._id, bser, function() {
			res.redirect('/admin/bserList/');
		});
		return;
	} else {
		bserDAO.getBserByName(bser.name, function(err, obj) {
			if (err) {
				throw err;
			}
			if (!bser) {
				res.redirect('/404');
				return;
			}
			if (obj) {
				res.redirect('/admin/bserList/');
				console.warn('name 已经存在.前端校验失败,或是非法提交.');
				return;
			}
			bserDAO.newAndSave(bser, function() {
				res.redirect('/admin/bserList/');
			});
			return;
		});
	}

}