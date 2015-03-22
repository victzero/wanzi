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