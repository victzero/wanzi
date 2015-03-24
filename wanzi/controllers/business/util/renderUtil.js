/**
 * 在每一个商家页面render时,需要添加一些共有的参数.
 */
var cateDAO = require('../../../dao').CateDAO;

var fmt = require('zero').fmt;
var extend = require('zero').extend;
var FlipFilter = require('zero').FlipFilter;

exports.render = function(res, file, mess) {
	var navFilter = new FlipFilter();
	cateDAO.flip(navFilter, function(err, cates) {
		if (err) {
			throw err;
		}
		extend(mess, {
			navs: cates,
			fmt: fmt,
		});
		res.render(file, mess);
	});
}