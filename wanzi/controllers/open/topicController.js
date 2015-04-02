/**
 * 文章管理.
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
var topicDAO = require('../../dao').TopicDAO;
var cateDAO = require('../../dao').CateDAO;
var constDAO = daoPool.ConstDAO;

/**
 * 前端列表接口.
 * @param  {[type]} req      [description]
 * @param  {[type]} res      [description]
 * @param  {[type]} category [description]
 * @return {[type]}          [description]
 */
exports.list = function(req, res, category) {
	cateDAO.getCateByPN(category, function(err, cate) { // 查找子项
		if (err) {
			throw err;
		}
		if (!cate) {
			res.json({
				'code': -21,
				'mess': '请求的类别不存在'
			});
			return;
		}

		var stitle = req.query['s_title'] || req.body['s_title'];
		var pageNo = req.query['pageNo'] || req.body['pageNo'];
		var filter = new FlipFilter();
		filter.category = category;
		if (stitle) {
			filter.title = stitle;
		}
		if (pageNo) {
			filter.pageNo = pageNo;
		}

		topicDAO.flip(filter, function(err, list) {
			if (err) {
				throw err;
			}

			res.json({
				code: 200,
				title: cate.title,
				list: list,
				filter: filter.init()
			});
			return;
		});
	});
}

/**
 * 详情
 */
exports.detail = function(req, res, category) {
	cateDAO.getCateByPN(category, function(err, cate) { // 查找子项
		if (err) {
			throw err;
		}
		if (!cate) {
			res.json({
				'code': -22,
				'mess': '请求的类别不存在'
			});
			return;
		}
		var id = req.query['id'];
		if (id.length != 24) {
			res.json({
				'code': -22,
				'mess': '请求的文章不存在'
			});
			return;
		}
		topicDAO.getTopicById(id, function(err, obj) {
			if (err) {
				throw err;
			}

			if (obj) {
				res.json({
					code: 200,
					title: obj.title,
					topic: obj,
				});
				return;
			} else {
				res.json({
					'code': -22,
					'mess': '请求的文章不存在'
				});
				return;
			}

		});
	});
}