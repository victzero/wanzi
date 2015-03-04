var fs = require('fs');
var path = require('path');
var EventProxy = require('eventproxy');
var url = require('url');

var cateDAO = require('../../dao').CateDAO;
var topicDAO = require('../../dao').TopicDAO;

var config = require('../../config');
var topicDAO = require('../../dao').TopicDAO;
var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;

var HOMEIMG = 'homeimg';
var CATELIST = 'hulanfenlei';
var CPLIST = 'chanpin';
var XINWENLIST = 'xinwen';
var TYPE = 'type';

/**
 * 中间件,添加基本信息.
 */
exports.init = function(req, res, next) {
	if (url.parse(req.url).pathname.indexOf('/admin') == 0) {
		next();
		return;
	}
	var ep = EventProxy.create(CATELIST, XINWENLIST, function(cates, news) {
		res.locals.cates = cates;
		res.locals.fmt = fmt;
		res.locals.news = news;

		var pathname = url.parse(req.url).pathname;
		var paths = pathname.split('/');
		var navID;
		switch (paths[2]) {
		case 'chanpin':
			navID = '3';
			break;
		case 'xinwen':
			navID = '4';
			break;
		default:
			navID = '1';
			break;
		}
		res.locals.navID = navID;

		next();
		return;
	});

	ep.fail(function(err) {
		if (err) {
			throw err;
		}
	});

	// 护栏分类列表.
	var filter = new FlipFilter();
	cateDAO.flip(filter, function(err, cates) {
		if (err) {
			throw err;
		}

		ep.emit(CATELIST, cates);
	});

	// 产品实例列表.
	filter = new FlipFilter();
	filter.category = 'xinwen';
	topicDAO.flip(filter, function(err, topics) {
		if (err) {
			throw err;
		}
		ep.emit(XINWENLIST, topics);
	});
}

/**
 * 首页
 */
exports.index = function(req, res) {

	var ep = EventProxy.create(HOMEIMG, CPLIST, TYPE, function(homeimgs,
			products, types) {
		res.render('open/index', {
			title : '塑钢护栏_围墙栏杆_草坪护栏围栏_PVC护栏栅栏-科盛护栏',
			description: '苏州科盛护栏是一家专业从事护栏生产的厂家，主要生产塑钢护栏、草坪护栏、围墙栏杆、PVC护栏、PVC栅栏、草坪围栏、围墙栅栏等护栏产品。所生产的护栏造型新颖、品位高雅、亮丽光洁、质量牢固。联系电话：13962406197',
			keywords: '塑钢护栏,草坪护栏,围墙栏杆,PVC护栏,PVC栅栏,草坪围栏',
			homeimgs : homeimgs,
			products : products,
			types : types
		});
	});

	ep.fail(function(err) {
		if (err) {
			throw err;
		}
	});

	// 滚动图列表.
	var filter = new FlipFilter();
	filter.category = HOMEIMG;
	topicDAO.flip(filter, function(err, topics) {
		if (err) {
			throw err;
		}
		ep.emit(HOMEIMG, topics);
	});

	// 产品实例列表.
	filter = new FlipFilter();
	filter.category = 'chanpin';
	topicDAO.flip(filter, function(err, topics) {
		if (err) {
			throw err;
		}
		ep.emit(CPLIST, topics);
	});

	// 型号展示列表.
	filter = new FlipFilter();
	filter.category = 'type';
	topicDAO.flip(filter, function(err, topics) {
		if (err) {
			throw err;
		}
		ep.emit(TYPE, topics);
	});
}
