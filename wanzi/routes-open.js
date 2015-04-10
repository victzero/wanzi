var url = require('url');

var home = require('./controllers/open/home');
var topic = require('./controllers/open/topic');
var error = require('./controllers/error');
var config = require('./config');

var ctrlHome = './controllers/open/';
var vistorController = require(ctrlHome + 'vistorController');
var topicController = require(ctrlHome + 'topicController');
var packageController = require(ctrlHome + 'packageController');
var commentController = require(ctrlHome + 'commentController');

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

	app.get('/package/list', packageController.list);
	app.get('/package/receive', packageController.receive);

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
	//进行评论.
	app.get('/topic/comment/edit', function(req, res) {
		commentController.comment(req, res);
	});
	app.post('/topic/comment/edit', function(req, res) {
		commentController.comment(req, res);
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