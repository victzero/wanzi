/**
 * 访客管理.
 */
var fs = require('fs');
var path = require('path');
var sys = require('sys');
var config = require('../../config');
var crypto = require('crypto');

//工具类
var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;
var extend = require('zero').extend;
var renderUtil = require('./util/renderUtil');

// DAO.
var daoPool = require('../../dao');
var vistorDAO = daoPool.VistorDAO;
var constDAO = daoPool.ConstDAO;

exports.tempLogin = function(req, res) {
	var name = req.query.name || req.body.name; //登录名
	var aliasname = req.query.aliasname || req.body.aliasname;
	var type = req.query.type || req.body.type;
	var password = req.query.password || req.body.password;

	//validation
	if (!type) { // app用户为 2
		type = 0;
	}

	if (!name) {
		res.json({
			'code': -1,
			'msg': '用户名不能为空'
		});
		return;
	}
	if (!password) {
		res.json({
			'code': -12,
			'msg': '密码不能为空'
		});
		return;
	}

	vistorDAO.getByName(name, function(err, obj) {
		if (err) {
			throw err;
		}

		if (!obj) { //该用户不存在
			constDAO.getVistorNum(function(num) {
				var vis = {
					name: name,
					aliasname: '游客_' + num,
					password: password,
					type: type
				};
				vistorDAO.saveUser(vis, function() {
					res.json({
						'code': 1,
						'msg': '用户创建成功',
						'name': name,
						'aliasname': vis.aliasname
					})
					return;
				});
			});

		} else { //该用户已经存在, 校验密码
			if (obj.password == md5(password)) {
				res.json({
					'code': 2,
					'msg': '用户成功登录',
					'name': obj.name,
					'aliasname': obj.aliasname
				})
				return;
			} else {
				res.json({
					'code': -13,
					'msg': '密码错误'
				})
				return;
			}
		}
	});
}

function md5(str) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
}