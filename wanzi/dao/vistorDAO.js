var model = require('../model');
var mdao = model.Vistor;
var crypto = require('crypto');
var genericDAO = require('./genericDAO')
	//继承genericDAO的方法.
genericDAO.extend(exports);

/********** 定制方法 ************/
/**
 * 根据登录名查找.
 * @param  {[type]}   name     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.getByName = function(name, callback) {
	exports.getByProperty({
		'name': name
	}, callback)
}

exports.saveUser = function(tmp, callback) {
	tmp.password = md5(tmp.password);
	exports.save(tmp, callback);
}

function md5(str) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
}