/**
 * business user
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config').config;

var bserSchema = new Schema({
	name: {
		type: String,
		index: true,
		unique: true
	},
	aliasname: {
		type: String,
	},
	password: String,
	inusing: {
		type: Boolean,
		default: true
	},
	createTime: {
		type: Date,
		default: Date.now
	},
	modifyTime: {
		type: Date,
		default: Date.now
	},
});

mongoose.model('BSER', bserSchema);