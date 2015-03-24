/**
 * business user
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config').config;

var bserSchema = new Schema({
	name : {
		type : String,
		index : true,
		unique : true
	},
	aliasname : {
		type : String,
	},
	password : String,
});

mongoose.model('BSER', bserSchema);