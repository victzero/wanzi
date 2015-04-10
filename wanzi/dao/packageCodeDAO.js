var model = require('../model');
var mdao = model.PackageCode;
var genericDAO = require('./genericDAO').gDAO;
var util = require('util')
var zutil = require('zero').util;

var packageCodeDAO = zutil.createClass(genericDAO, {
	/**
	 * Constructor
	 */
	initialize: function() {
		this.callSuper('initialize', mdao);
	},

});

exports.$ = packageCodeDAO;