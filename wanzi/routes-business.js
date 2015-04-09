//TODO:商家使用界面.
var url = require('url');

var controller = './controllers/business';
var home = require('./controllers/business/home');
var login = require('./controllers/business/login');
var section = require('./controllers/business/section');
var vistorController = require(controller + '/vistorController');
var commentController = require(controller + '/commentController');


var file = require('./controllers/admin/file');

module.exports = function(app) {

	// app.get('/business/*', function(req, res){

	// });

	//首页
	app.get('/business', home.index);
	app.get('/business/index', home.index);

	//登录
	app.get('/business/login', login.loginG);
	app.post('/business/login', login.loginP);
	app.get('/business/logout', login.logout);

	//访客管理
	app.get('/business/vistor/list', vistorController.list);
	app.post('/business/vistor/list', vistorController.list);

	//动态类别,section
	//查询
	app.get('/business/sectionList/*', function(req, res) {
		sectionSplit(req, res, section.list);
	});
	app.post('/business/sectionList/*', function(req, res) {
		sectionSplit(req, res, section.list);
	});
	//编辑
	app.get('/business/sectionEdit/*', function(req, res) {
		sectionSplit(req, res, section.edit);
	});
	app.post('/business/sectionEdit/*', function(req, res) {
		sectionSplit(req, res, section.editP);
	});
	//详情
	app.get('/business/sectionDetail/*', function(req, res) {
		sectionSplit(req, res, section.detail);
	});
	//删除
	app.get('/business/sectionRemove/*', function(req, res) {
		sectionSplit(req, res, section.remove);
	});
	//评论
	app.get('/business/sectionComment/*', function(req, res) {
		sectionSplit(req, res, commentController.list)
	});

	// 文件上传
	app.post('/res/fileupload', file.upload);
}

var sectionSplit = function(req, res, callback) {
	var pathname = url.parse(req.url).pathname;
	var paths = pathname.split('/');
	var args = paths.slice(3);

	callback.apply(null, [req, res].concat(args));
	return;
}