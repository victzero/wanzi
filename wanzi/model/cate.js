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
	fields : [{
		name: String,//键名
		alias: String,//别名
		type:{ type : String, default: 'String' } ,//字段类型,String, Number, Boolean, Date
		editor:{ type : String, default: 'input-text' } ,//编辑器类别.
		sortNum: { type : Number, default: 0 } ,
		modifyTime : { type : Date, default: Date.now } ,
	}],
	inusing : { type : Boolean, default: true } ,
	totalcount : { type : Number, default: 0 } ,
	createTime : { type : Date, default: Date.now } ,
	modifyTime : { type : Date, default: Date.now } ,
});

mongoose.model('CATE', CateSchema);