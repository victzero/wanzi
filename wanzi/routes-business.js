//TODO:商家使用界面.
var url = require('url');

var home = require('./controllers/business/home');
var login = require('./controllers/business/login');

module.exports = function(app) {

	// app.get('/business/*', function(req, res){

	// });

	//首页
	app.get('/business', home.index);
	app.get('/business/index', home.index);

	//登录
	app.get('/business/login', login.loginG);
	// app.post('/business/login', login.loginP);
	app.get('/business/logout', login.logout);
}