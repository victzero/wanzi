var url = require('url');

var home = require('./controllers/open/home');
var topic = require('./controllers/open/topic');
var error = require('./controllers/error');
var config = require('./config');
var vistorController = require('./controllers/open/vistorController');

module.exports = function(app) {

	// 首页
	app.get('/', home.index);
	app.get('/index', home.index);
	app.get('/topicDetail/:category/:id', topic.detail);
	app.get('/list/:category', topic.list);
	app.get('/list/:category/:pageNo', topic.list);

	//登录
	app.get('/vistor/login', vistorController.tempLogin);
	app.post('/vistor/login', vistorController.tempLogin);

	app.get('/company/info', function(req, res) {
		res.render('open/companyInfo', {
			title: '科盛护栏-关于我们',
			navID: '2'
		});
		return;
	});

	app.get('/company/contact', function(req, res) {
		res.render('open/companyContact', {
			title: '科盛护栏-联系我们',
			navID: '5'
		});
		return;
	});

	app.get('/company/honors', function(req, res) {
		res.render('open/honors', {
			title: '科盛护栏-荣誉资质',
			navID: '6'
		});
		return;
	});

	app.get('/404', error.gt404);
	app.get('/500', error.gt500);

	app.get('/*', function(req, res) {
		res.redirect('/404');
	});

};