var fs = require('fs');
var path = require('path');
var config = require('../../config');
var cateDAO = require('../../dao').CateDAO;
var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;

var cons = {
	name : '护栏类别',
	navID_list : '21',
	navID_edit : '21',
};

/**
 * 类别列表
 */
exports.list = function(req, res) {
	var stitle = req.query['s_title'] || req.body['s_title'];

	var filter = new FlipFilter(req.body.filter);

	if (stitle) {
		filter.title = stitle;
	}
	cateDAO.flip(filter, function(err, cates) {
		if (err) {
			throw err;
		}

		res.render('admin/cateList', {
			title : cons.name + '管理',
			list : cates,
			fmt : fmt,
			s_title : stitle,
			cons : cons,
			filter : filter.init()
		});
	});
}

exports.edit = function(req, res) {
	var id = req.query['id'];
	if (id) {// 修改
		cateDAO.getCateById(id, function(err, obj) {
			if (err) {
				throw err;
			}
			res.render('admin/cateEdit', {
				title : cons.name + '管理-修改' + '--' + obj.title,
				obj : obj,
				cons : cons
			});
		});
	} else {// 添加
		res.render('admin/cateEdit', {
			title : cons.name + '管理-添加',
			obj : {},
			cons : cons
		});
	}
}

exports.remove = function(req, res) {
	var id = req.query['id'];
	if (id) {
		cateDAO.shutById(id, function(err, count) {
			res.redirect('/admin/cateList/');
		});
	} else {
		res.redirect('/admin/cateList/');
	}
}

exports.editP = function(req, res) {
	var cate = req.body.obj;

	if (cate._id) {
		cate.modifyTime = Date.now();
		cateDAO.update(cate._id, cate, function() {
			res.redirect('/admin/cateList/');
		});
		return;
	} else {
		cateDAO.getCateByPN(cate.pathname, function(err, obj) {
			if (err) {
				throw err;
			}
			if (!cate) {
				res.redirect('/404');
				return;
			}
			if (obj) {
				res.redirect('/admin/cateList/');
				console.warn('pathname 已经存在.前端校验失败,或是非法提交.');
				return;
			}

			cateDAO.newAndSave(cate, function() {
				res.redirect('/admin/cateList/');
			});
			return;
		});
	}

}
