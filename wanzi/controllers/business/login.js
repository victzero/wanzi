// 显示登录页
exports.loginG = function(req, res) {
	if (req.session.user) {
		res.redirect('/business');
		return;
	}
	res.render('business/login', {
		title : '登录控制台'
	});
}

exports.logout = function(req, res) {
	req.session.user = null;
	res.redirect('/business/login');
}