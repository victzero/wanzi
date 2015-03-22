var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;

var cateDAO = require('../../dao').CateDAO;

exports.index = function(req, res) {
	var filter = new FlipFilter( );
	cateDAO.flip(filter, function(err, cates) {
		if (err) {
			throw err;
		}

		res.render('business/index', {
			title: '欢迎来到信息发布系统商家控制台',
			navs: cates,
			fmt: fmt,
			filter: filter.init()
		});
	});
}