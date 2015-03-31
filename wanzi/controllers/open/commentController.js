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

/**
 * 对指定内容进行评论.
 * er: /topic/comment/edit?title=title&content=content&targetType=1&topicID=1
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.comment = function(req, res) {
	var vistor = req.session.vistor;
	if (!vistor) {
		res.json({
			'code': -3,
			'mess': '用户未登录'
		});
		return;
	}

	var title = req.query.title || req.body.title; //评论标题
	var content = req.query.content || req.body.content; //评论内容
	var targetType = req.query.targetType || req.body.targetType; //评论的目标类型
	var topicID = req.query.topicID || req.body.topicID; //评论的topic主键
	var commentID = req.query.commentID || req.body.commentID; //评论的主键

	if (!title || title.length == 0 || !content || content.length == 0) {
		res.json({
			'code': -32,
			'mess': '无内容'
		});
		return;
	}

	if (targetType == 1) { //topic
		//校验topic是否存在.
		//找到topic,并将其num_comment + 1
		topicDAO.getTopicById(topicID, function(err, obj) { //找到记录.
			if (err) {
				throw err;
			}
			if (obj) { //存在文章

				//TODO:是否开启评论功能.

				commentDAO.save({
					title: title,
					content: content,
					vistorName: vistor.aliasname,
					vistorId: vistor._id,
					topicID: topicID,
					parent: null,
				}, function(err, cmt) {
					if (err) {
						console.log('评论失败')
						console.log(err)
						throw err
					}
					obj.num_comment = obj.num_comment + 1;
					obj.save(function() {
						res.json({
							'code': 200,
							'mess': '保存成功'
						});
						return;
					});
				});
			} else { //不存在文章.
				res.json({
					'code': -35,
					'mess': '未找到相关文章'
				})
				return
			}
		})
	} else if (targetType == 2) { //comment
		if (!comment) {
			res.json({
				'code': -33,
				'mess': '缺少评论主键'
			})
			return;
		}
		commentDAO.save({
			title: title,
			content: content,
			vistorName: vistor.aliasname,
			vistorId: vistor._id,
			topicID: topicID,
			parent: commentID,
		}, function(err, obj) {
			if (err) {
				console.log('评论失败')
				console.log(err)
				throw err
			}
			res.json({
				'code': 200,
				'mess': '保存成功'
			});
			return;
		});
	} else {
		res.json({
			'code': -31,
			'mess': '目标类型错误'
		})
		return
	}
}