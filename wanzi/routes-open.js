var url = require('url');

var home = require('./controllers/open/home');
var topic = require('./controllers/open/topic');
var error = require('./controllers/error');
var config = require('./config');

var ctrlHome = './controllers/open/';
var vistorController = require(ctrlHome + 'vistorController');
var topicController = require(ctrlHome + 'topicController');

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

	//动态类别. eg: /topic/list/testing?pageNo=2
	app.get('/topic/list/*', function(req, res) {
		sectionSplit(req, res, topicController.list);
	});
	app.post('/topic/list/*', function(req, res) {
		sectionSplit(req, res, topicController.list);
	});
	//详情. eg: /topic/detail/testing?id=***
	app.get('/topic/detail/*', function(req, res) {
		sectionSplit(req, res, topicController.detail);
	});


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

var sectionSplit = function(req, res, callback) {
	var pathname = url.parse(req.url).pathname;
	var paths = pathname.split('/');
	var args = paths.slice(3);

	callback.apply(null, [req, res].concat(args));
	return;
}