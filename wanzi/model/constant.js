/**
 * constant, 变量.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config').config;

var schema = new Schema({

	name: { //key
		type: String,
		index: true,
		unique: true
	},
	constval: {
		type: String
	},

	createTime: { //创建时间
		type: Date,
		default: Date.now
	},
	modifyTime: { //修改时间.
		type: Date,
		default: Date.now
	},
});

mongoose.model('CONSTANT', schema);