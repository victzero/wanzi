var notJump = [ '/login' ];

exports.userNeeded = function(req, res, next) {
	if (!req.session.user) {// 未登录,前往登陆页面.
		var url = req.url;
		for ( var i = 0, len = notJump.length; i !== len; ++i) {
			if (url.indexOf(notJump[i]) >= 0) {// 正在进行登录操作,允许通过.
				next();
				return;
			}
		}
		// 访问无权限的页面.
		res.redirect('/admin/login');
        return;
	} else {// 已经登录,继续.
		next();
        return;
	}
}