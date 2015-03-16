var url = require('url');

var home = require('./controllers/admin/home');
var login = require('./controllers/admin/login');
var instance = require('./controllers/admin/instance');
var cate = require('./controllers/admin/cate');
var section = require('./controllers/admin/section');
var fetchData = require('./controllers/admin/fetchData')
var file = require('./controllers/admin/file');
var config = require('./config');

module.exports = function(app) {

	// 首页
	app.get('/admin', home.index);
	app.post('/admin', home.index);
	app.get('/admin/homeimgEdit', home.edit);
	app.post('/admin/homeimgEdit', home.editP);
	app.get('/admin/homeimgRemove', home.remove);
	app.get('/admin/homeimgDetail', home.detail);

	// 登陆页
	app.get('/admin/login', login.loginG);
	app.post('/admin/login', login.loginP);
	app.get('/admin/logout', login.logout);

	// 产品实例
	app.get('/admin/instanceList/*', function(req, res) {
		routeSplit(req, res, instance.list);
	});
	app.post('/admin/instanceList/*', function(req, res) {
		routeSplit(req, res, instance.list);
	});
	app.get('/admin/instanceEdit/*', function(req, res) {
		routeSplit(req, res, instance.edit);
	});
	app.post('/admin/instanceEdit/*', function(req, res) {
		routeSplit(req, res, instance.editP);
	});
	app.get('/admin/instanceDetail/*', function(req, res) {
		routeSplit(req, res, instance.detail);
	});
	app.get('/admin/instanceRemove/*', function(req, res) {
		routeSplit(req, res, instance.remove);
	});

	// 护栏分类列表.
	app.get('/admin/cateList', cate.list);
	app.post('/admin/cateList', cate.list);
	app.get('/admin/cateEdit', cate.edit);
	app.post('/admin/cateEdit', cate.editP);
	app.get('/admin/cateRemove', cate.remove);

	// 动态类别,section.
	app.get('/admin/sectionList/*', function(req, res) {
		routeSplit(req, res, section.list, true);
	});
	app.post('/admin/sectionList/*', function(req, res) {
		routeSplit(req, res, section.list, true);
	});
	app.get('/admin/sectionEdit/*', function(req, res) {
		routeSplit(req, res, section.edit, true);
	});
	app.post('/admin/sectionEdit/*', function(req, res) {
		routeSplit(req, res, section.editP, true);
	});
	app.get('/admin/sectionDetail/*', function(req, res) {
		routeSplit(req, res, section.detail, true);
	});
	app.get('/admin/sectionRemove/*', function(req, res) {
		routeSplit(req, res, section.remove, true);
	});

	//数据抓取.
	app.get('/admin/fetchData/jimuBox', function(req, res){
		fetchData.jimubox_list(req,res);
	});
	app.get('/admin/fetchData/jimubox_update', function(req, res){
		fetchData.jimubox_update(req,res);
	});
	app.get('/admin/fetchData/jimubox_interval', function(req, res){
		fetchData.jimubox_interval(req,res);
	});
	app.get('/admin/fetchData/tacticsList', function(req, res){
		fetchData.tacticsList(req,res);
	});

	// 文件上传
	app.post('/admin/fileupload', file.upload);

};

var routeSplit = function(req, res, callback, dontCheck) {
	var pathname = url.parse(req.url).pathname;
	var paths = pathname.split('/');
	var args = paths.slice(3);

	if (dontCheck) {
		callback.apply(null, [ req, res ].concat(args));
		return;
	}

	var cate = paths[3];
	if (instance.assertIns(cate)) {
		callback.apply(null, [ req, res ].concat(args));
		return;
	}
	res.redirect(config.error404);
	return;

};