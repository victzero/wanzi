var fs = require('fs');
var path = require('path');
var EventProxy = require('eventproxy');

var cateDAO = require('../../dao').CateDAO;
var topicDAO = require('../../dao').TopicDAO;

var config = require('../../config');
var topicDAO = require('../../dao').TopicDAO;
var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;

var CPLIST = 'chanpin';

var cons = {
	'chanpin' : {
		title : '科盛护栏_产品实例',
		name : '产品实例'
	},
	'xinwen' : {
		title : '科盛护栏_业内新闻',
		name : '业内新闻'
	},
	'type' : {
		title : '科盛护栏_型号展示',
		name : '型号展示'
	}
}

exports.list = function(req, res) {
	var pageNo = req.param('pageNo');
	var category = req.param('category');
	if (!pageNo) {
		pageNo = 1;
	}

	var filter = new FlipFilter();

	var ep = EventProxy.create(CPLIST, function(topics) {

		var mess = cons[category];
		if (mess) {
			res.render('open/topicList', {
				title : mess.title,
				list : topics,
				mess : mess,
				category : category,
				filter : filter.init()
			});
			return;
		} else {
			cateDAO.getCateByPN(category, function(err, cate) {// 查找子项
				if (err) {
					throw err;
				}
				if (!cate) {
					res.redirect('/404');
					return;
				}
				var mess = {
					title : cate.title + '_护栏分类_科盛护栏',
					name : cate.title,
					isChild : true,
				};
				res.render('open/topicList', {
					title : mess.title,
					list : topics,
					mess : mess,
					category : category,
					filter : filter.init()
				});
				return;
			});
		}
	});

	ep.fail(function(err) {
		if (err) {
			throw err;
		}
	});

	filter.category = category;
	filter.pageNo = pageNo;
	topicDAO.flip(filter, function(err, topics) {
		if (err) {
			throw err;
		}
		ep.emit(CPLIST, topics);
	});

}

exports.detail = function(req, res) {
	var category = req.param('category');
	var id = req.param('id');
	topicDAO.getTopicById(id, function(err, obj) {
		if (err) {
			throw err;
		}

		var mess = cons[category];
		if (mess) {
			res.render('open/topicDetail', {
				title : obj.title + '_' + mess.title,
				description: obj.description,
				obj : obj,
				mess : mess,
			});
		} else {
			cateDAO.getCateByPN(category, function(err, cate) {// 查找子项
				if (err) {
					throw err;
				}
				if (!cate) {
					res.redirect('/404');
					return;
				}
				var mess = {
					title : cate.title + '_护栏分类_科盛护栏',
					name : cate.title,
					isChild : true,
				};
				res.render('open/topicDetail', {
					title : mess.title + '_' + obj.title,
					description: obj.description,
					obj : obj,
					mess : mess,
				});
				return;
			});
		}
	});
}