var url = require('url');
var ar = require('./routes-admin');
var or = require('./routes-open');
var fs = require("fs");

module.exports = function(app) {

	// 先进行手工路由匹配
	manualRoute(app);

	// 取消...手动路由失败后，进行自动路由匹配
	// app.all('/*', autoRoute);
}

var manualRoute = function(app) {

	app.get('/sitemap.xml', function(req, res) {
		
		fs.readFile('assets/sitemap.xml', "binary", function (err, file) {
			if(err){
				res.redirect('/404');
			}else{
				res.writeHead(200, {"Content-Type": "text/xml"}); 
				res.write(file, "binary");
				res.end();
			}
		});
		
//		res.writeHead(200, {"Content-Type": "text/xml"}); 
//		res.write('<?xml version=\"1.0\" encoding=\"UTF-8\"?>');
//		res.write('<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">');
//		res.write('<url>');
//		res.write('<loc>http://keshenghl.com/</loc>');
//		res.write('<priority>1.0</priority>');
//		res.write('<lastmod>2014-04-02T23:17:14+00:00</lastmod>');
//		res.write('<changefreq>Daily</changefreq>');
//		res.write('</url>');
//		res.write('</urlset>');
//		res.end();
		return;
	});
	
	app.get('/robots.txt', function(req, res){
		
		fs.readFile('assets/robots.txt', "binary", function (err, file) {
			if(err){
				res.redirect('/404');
			}else{
				res.writeHead(200, {"Content-Type": "text/plain"});
				res.write(file, "binary");
				res.end();
			}
		});
		
//		res.writeHead(200, {"Content-Type": "text/plain"});
//		res.write('User-agent: *');
//		res.write('Disallow: /admin');
//		res.write('Allow: /');
//		res.write('Sitemap: http://115.29.226.180/Sitemap.xml');
//		res.end();
		return;
	});

	ar(app);
	
	or(app);

}

var autoRoute = function(req, res) {
	var pathname = url.parse(req.url).pathname;
	var paths = pathname.split('/');
	var controller = paths[1] || 'index';
	var action = paths[2] || 'index';
	var args = paths.slice(3);
	var module;
	try {
		module = require('./controllers/' + controller);
	} catch (ex) {
		handle404(req, res);
		return;
	}

	var method = module[action];
	if (method) {
		method.apply(null, [ req, res ].concat(args));
	} else {
		handle404(req, res);
	}

}

var handle404 = function(req, res) {
	res.writeHead(404);
	res.end('error');
}