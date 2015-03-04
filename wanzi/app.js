var path = require('path');
var ndir = require('ndir');
var express = require('express');
var ejs = require('ejs');
var routes = require('./routes');
var config = require('./config').config;
var adminFilter = require('./filter/adminFilter').userNeeded;

var home = require('./controllers/open/home');

var maxAge = 3600000 * 24 * 30;
var staticDir = path.join(__dirname, 'assets');// 静态文件存放更目录.

config.upload_temp_dir = config.upload_temp_dir
		|| path.join(__dirname, 'assets', 'user_data');
// ensure upload dir exists
ndir.mkdir(config.upload_temp_dir, function(err) {// 建立上传文件目录
	if (err) {
		throw err;
	}
});

config.upload_img_dir = config.upload_img_dir
		|| path.join(__dirname, 'assets', 'user_data', 'images');
ndir.mkdir(config.upload_img_dir, function(err) {// 建立上传文件目录
	if (err) {
		throw err;
	}
});

var app = express();

ejs.open = '{{';
ejs.close = '}}';

// all environments
app.configure(function() {
	app.set('title', 'Zero App');
	app.set('port', 80);
	app.set('env', 'production');

	app.engine('.html', ejs.__express);
	app.set('view engine', 'html');
	app.set('views', path.join(__dirname, 'views'));// html 文件存放目录

	app.use(express.cookieParser());
	app.use(express.session({
		secret : config.session_secret
	}));

	// --- 设置中间件 ---
	app.use(express.favicon(path.join(__dirname,'assets/img/favicon.ico')));
	app.use('/assets', express.static(staticDir));
	app.use(express.logger('dev'));

	app.use('/admin', adminFilter);
	app.use('/', home.init);

	app.use(express.bodyParser({
		uploadDir : config.upload_temp_dir
	}));
	app.use(express.methodOverride());

	// 配置路由
	routes(app);
})

// development only
app.configure('development', function() {
	app.use(express.errorHandler());
})

// production only
app.configure('production', function() {
	app.use(function(err, req, res, next) {
		console.error(err.stack);
		res.redirect('/500');
	});
});

app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});