var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config').config;

/**
 * 礼包
 * @type {Schema}
 */
var PackageCodeSchema = new Schema({
	code: { //代码
		type: String,
	},

	package_id: {
		type: String
	},

	inusing : { type : Boolean, default: true } ,

	createTime: {
		type: Date,
		default: Date.now
	},
	modifyTime: {
		type: Date,
		default: Date.now
	},
});

mongoose.model('PACKAGECODE', PackageCodeSchema);