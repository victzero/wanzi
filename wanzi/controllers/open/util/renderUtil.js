/**
 * 在每一个商家页面render时,需要添加一些共有的参数.
 */
var fmt = require('zero').fmt;
var extend = require('zero').extend;
var FlipFilter = require('zero').FlipFilter;

exports.render = function(res, file, mess) {
	var navFilter = new FlipFilter();
	extend(mess, {
		fmt: fmt,
	});
	res.render(file, mess);
}