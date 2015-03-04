var validator = require('validator');
var crypto = require('crypto');

var userDAO = require('../../dao').UserDAO;

// 显示登录页
exports.loginG = function(req, res) {
	if (req.session.user) {
		res.redirect('/admin');
		return;
	}
	res.render('admin/login', {
		title : '登录控制台'
	});
}

exports.logout = function(req, res) {
	req.session.user = null;
	res.redirect('/admin/login');
}

/**
 * define some page when login just jump to the home page
 * 
 * @type {Array}
 */
var notJump = [ '/admin/reset_pass', // reset password page, avoid to reset
										// twice
'/admin/login', // 登录页
];

// 提交登录信息
exports.loginP = function(req, res, next) {
	var user = req.body.user;
	if (!user.name || !user.password) {
		return res.render('admin/login', {
			title : '登录控制台-登录失败',
			error : '信息不完整.'
		});
	}

	// userDAO.newAndSave(user.name,'管理员', md5(user.password));
	userDAO.getUserByName(user.name, function(err, dbUser) {
		if (err) {
			return next(err);
		}
		if (!dbUser) {
			return res.render('admin/login', {
				title : '登录控制台-登录失败',
				error : '用户名或密码错误。'
			});
		}
		var pass = md5(user.password);
		if (pass !== dbUser.password) {
			return res.render('admin/login', {
				title : '登录控制台-登录失败',
				error : '用户名或密码错误。'
			});
		}

		req.session.user = dbUser;

		var refer = req.session._loginReferer || '/admin';
		for ( var i = 0, len = notJump.length; i !== len; ++i) {
			if (refer.indexOf(notJump[i]) >= 0) {
				refer = 'home';
				break;
			}
		}
		res.redirect(refer);

	});
}

function md5(str) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
}