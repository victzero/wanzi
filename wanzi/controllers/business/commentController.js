/**
 * 评论管理.
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
var commentDAO = daoPool.CommentDAO;
var cateDAO = daoPool.CateDAO;
var topicDAO = daoPool.TopicDAO;


exports.list = function(req, res, category) {
	cateDAO.getCateByPN(category, function(err, cate) { // 查找子项
		if (err) {
			throw err;
		}
		if (!cate) {
			res.redirect('/404');
			return;
		}

		var tid = req.query['tid'];
		topicDAO.getTopicById(tid, function(err, obj) { //找到记录.
			if (err) {
				throw err;
			}
			if (obj) { //存在文章
				var filter = new FlipFilter(req.body.filter);
				commentDAO.flipComments(tid, filter, function(err, list) {
					// console.log('评论列表')
					// console.log(list)
					renderUtil.render(res, 'business/sectionComment', {
						title: obj.title + '--评论查看',
						topic: obj,
						list: list,
						cate: cate,
						filter: filter.init()
					});
				})
			} else { //不存在文章.
				res.redirect('/404');
				return;
			}
		})

	});

}