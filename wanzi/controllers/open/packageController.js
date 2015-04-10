/**
 * 礼包管理.
 */
var fs = require('fs');
var path = require('path');
var sys = require('sys');
var config = require('../../config');
var crypto = require('crypto');

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
var constDAO = daoPool.ConstDAO;

//礼包列表
exports.list = function(req, res) {
	var query = req.body.query || {};
	var fq = new FlipQuery(query);
	var filter = new FlipFilter(req.body.filter);

	//query, filter, fields
	new packageDAO().flip(fq, filter, "title description yxq syl zl img", function(err, list) {
		if (err) {
			throw err;
		}

		res.json({
			list: list,
			filter: filter.init()
		});
		return;
	});
}

//礼包列表
exports.receive = function(req, res) {
	var vistor = req.session.vistor;
	if (!vistor) {
		res.json({
			'code': -3,
			'mess': '用户未登录'
		});
		return;
	}

	var id = req.query.id || req.body.id;

	var pcDAO = new packageCodeDAO();
	pcDAO.getFirst({
		package_id: id,
		inusing: true
	}, function(err, o) {
		if (err) {
			throw err
		}
		if (o) {
			pcDAO.save({
				_id: o.id,
				inusing: false
			}, function() {
				var pDAO = new packageDAO();
				pDAO.getById(id, function(err, p) {
					pDAO.save({
						_id: p._id,
						syl: p.syl - 1
					}, function(err) {
						if (err) {
							throw err;
						}
						res.json({
							code: 2,
							data: o
						})
					})
				})
			});
		} else {
			//已经领完
			res.json({
				code: -4,
				msg: '已经领完'
			})
		}

	})

}