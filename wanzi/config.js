/**
 * config
 */

var path = require('path');
var pkg = require('./package.json');

var config = {
	debug : true,
	name : 'zero web app',
	description : '',
	version : pkg.version,

	// site settings
	site_headers : [ '<meta name="author" content="ZERO" />', ],
	host : 'www.wanziwanzi.com',

	upload_img_dir : path.join(__dirname, 'assets', 'user_data', 'images'),
	relative_img_dir : '/assets/user_data/images/',
	upload_temp_dir : path.join(__dirname, 'assets', 'user_data', 'temp'),
	no_img : path.join(__dirname, 'assets', 'img', '206-200-NO_IMG.gif'),

	db : 'mongodb://115.29.226.180/kesheng',
	dbUser : 'keshengdb',
	dbPass : 'Keshengdb2014',
	session_secret : 'zero_app',

	// error
	error404 : '/error404',

	pageSize : 15,

}

module.exports = config;
module.exports.config = config;