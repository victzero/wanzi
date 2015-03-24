var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;

var cateDAO = require('../../dao').CateDAO;

var renderUtil = require('./util/renderUtil');

exports.index = function(req, res) {
	renderUtil.render(res, 'business/index', {
		title: '欢迎使用信息发布系统商家控制台',
		fmt: fmt,
	})
}