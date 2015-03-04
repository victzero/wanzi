var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config').config;

var CateSchema = new Schema({
	title : {
		type : String,
		index : true
	},
	pathname : { type : String, unique : true },
	keyword : String,
	inusing : { type : Boolean, default: true } ,
	totalcount : { type : Number, default: 0 } ,
	createTime : { type : Date, default: Date.now } ,
	modifyTime : { type : Date, default: Date.now } ,
});

mongoose.model('CATE', CateSchema);