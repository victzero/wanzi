/**
 * 访客管理.
 */
var fs = require('fs');
var path = require('path');
var sys = require('sys');
var config = require('../../config');

//工具类
var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;
var extend = require('zero').extend;
var renderUtil = require('./util/renderUtil');

// DAO.
var daoPool = require('../../dao');
var vistorDAO = daoPool.VistorDAO;

exports.list = function(req, res) {
	var filter = new FlipFilter(req.body.filter);

	//query, filter, fields
	vistorDAO.flip(null, filter, "name aliasname", function(err, list) {
		if (err) {
			throw err;
		}

		var cons = {
			name: '访客',
		};
		// extend(cons, rootCate);
		renderUtil.render(res, 'business/vistorList', {
			title: cons.name + '管理',
			list: list,
			cons: cons,
			filter: filter.init()
		});
	});

}