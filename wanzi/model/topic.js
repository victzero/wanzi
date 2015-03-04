var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config').config;

var TopicSchema = new Schema({
	title : {
		type : String,
		index : true,
	},
	keyword : {
		type : String,
	},
	description : {
		type : String,
	},
	img : String,
	imgalt : String,
	realpath : String,
	category : String,
	content : String,
	createTime : { type : Date, default: Date.now } ,
	modifyTime : { type : Date, default: Date.now } ,
});

mongoose.model('TOPIC', TopicSchema);