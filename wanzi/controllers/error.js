exports.gt404 = function(req, res) {
	res.statusCode = 404;
	res.render('open/error404', {
		title : '科盛护栏-请求错误,为找到您请求的页面',
		navID : '1'
	});
	return;
}

exports.gt500 = function(req, res) {
	res.statusCode = 500;
	res.render('open/error500', {
		title : '科盛护栏-服务器错误,请联系管理员',
		navID : '1'
	});
	return;
}