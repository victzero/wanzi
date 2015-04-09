var model = require('../model');
var mdao = model.Vistor;
var crypto = require('crypto');
var genericDAO = require('./genericDAO').gDAO;
var util = require('util')
var zutil = require('zero').util;

var vistorDAO = zutil.createClass(genericDAO, {
	/**
	 * Constructor
	 */
	initialize: function() {
		this.callSuper('initialize', mdao);
	},

	/********** 定制方法 ************/
	/**
	 * 根据登录名查找.
	 * @param  {[type]}   name     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	getByName: function(name, callback) {
		this.getByProperty({
			'name': name
		}, callback)
	},

	saveUser: function(tmp, callback) {
		tmp.password = zutil.md5(tmp.password);
		this.save(tmp, callback);
	},

});

exports.$ = vistorDAO;