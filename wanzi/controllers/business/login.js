// 显示登录页
var validator = require('validator');
var crypto = require('crypto');

var bserDAO = require('../../dao').BserDAO;

exports.loginG = function(req, res) {
	if (req.session.bser) {
		res.redirect('/business');
		return;
	}
	res.render('business/login', {
		title: '登录控制台'
	});
}

exports.logout = function(req, res) {
	req.session.bser = null;
	res.redirect('/business/login');
}

/**
 * define some page when login just jump to the home page
 *
 * @type {Array}
 */
var notJump = ['/business/reset_pass', // reset password page, avoid to reset
	// twice
	'/business/login', // 登录页
];

// 提交登录信息
exports.loginP = function(req, res, next) {
	var bser = req.body.bser;
	if (!bser.name || !bser.password) {
		return res.render('business/login', {
			title: '登录控制台-登录失败',
			error: '信息不完整.'
		});
	}

	// bserDAO.newAndSave(bser.name,'管理员', md5(bser.password));
	bserDAO.getBserByName(bser.name, function(err, dbBser) {
		if (err) {
			return next(err);
		}
		if (!dbBser) {
			return res.render('business/login', {
				title: '登录控制台-登录失败',
				error: '用户名或密码错误。'
			});
		}
		var pass = md5(bser.password);
		if (pass !== dbBser.password) {
			return res.render('business/login', {
				title: '登录控制台-登录失败',
				error: '用户名或密码错误。'
			});
		}

		req.session.bser = dbBser;

		var refer = req.session._b_loginReferer || '';
		for (var i = 0, len = notJump.length; i !== len; ++i) {
			if (refer.indexOf(notJump[i]) >= 0) {
				refer = 'home';
				break;
			}
		}
		res.redirect('/business' + refer);

	});
}

function md5(str) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
}