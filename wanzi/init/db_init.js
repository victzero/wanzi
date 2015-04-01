/**
 * 初始化脚本
 */
var db_clear = require('./db_clear');
var config = require('../config');
var pool = require('../daon/daonPool').pool;
var async = require('async');
var INIT_CONFIG = require('./config').config;

var SYSTEM_TABLES = [
	'cates', //所有动态分类

	'bsers', //business user
	'users', //管理员用户
];
var BUSINESS_TABLES = [
	'comments', //评论
	'constants', //全局变量
	'topics', //所有文章
	'vistors', //访客用户
];

var init = function() {
	console.log('开始执行初始化操作.')
	console.log('--------------------------------')
	async.series([
		function(cb) {
			clearData(cb);
		},
		function(cb) {
			createAdminUser(cb);
		},
		function(cb) {
			createBusinessUser(cb);
		},
		function(cb) {
			initCategory(cb);
		},
		function(cb) {
			processExit();
		},
	]);

}

var clearData = function(next) {
	console.log('1. 开始清空以下表:' + CLEAR_TABLES)
	db_clear.clear(SYSTEM_TABLES, function() {

		if (INIT_CONFIG.clearBusinessData == true) {
			db_clear.clear(BUSINESS_TABLES, function() {
				console.log('--------------------------------')
				next && next();
			});
		} else {
			console.log('--------------------------------')
			next && next();
		}
	});

}

var createAdminUser = function(next) {
	console.log('2. 初始化管理员用户.')
	var userDAO = require('../dao/userDAO');
	var admin = INIT_CONFIG.admin;
	userDAO.newAndSave(admin.name, admin.alias, admin.pass, function() {
		console.log('管理员"' + admin.name + '"添加成功.');
		console.log('--------------------------------');
		next && next();
	});

}

var createBusinessUser = function(next) {
	console.log('2. 初始化商家用户.')
	var bserDAO = require('../dao/bserDAO');
	var bser = INIT_CONFIG.bser;
	bserDAO.newAndSave({
		name: bser.name,
		aliasname: bser.alias,
		password: bser.pass
	}, function() {
		console.log('商家用户"' + bser.name + '"添加成功.');
		console.log('--------------------------------');
		next && next();
	});

}

var initCategory = function(next) {
	console.log('3. 初始化动态分类表.')
	var cateDAO = require('../dao/cateDAO');
	var cateConfig = INIT_CONFIG.category;
	async.eachSeries(cateConfig, function(cate, cb) {
		cateDAO.getCateByPN(cate.pathname, function(err, obj) {
			if (err) {
				console.error(err)
				cb();
				return;
			}
			if (obj) {
				console.warn('pathname: ' + cate.pathname + ' 已经存在.前端校验失败,或是非法提交.');
				cb();
				return;
			}

			cateDAO.create(cate, function() {
				console.info('"' + cate.title + '"创建成功')
				cb();
				return;
			});
		});
	}, function() {
		console.log('--------------------------------');
		next && next();
	})
}

var processExit = function() {
	console.log('脚本执行完毕.')
	process.exit();
}

init();