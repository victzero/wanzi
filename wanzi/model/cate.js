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
		type:{ type : String, default: 'String' } ,//字段类型,String, Number, Boolean, Date, Image
		editor:{ type : String, default: 'text' } ,//编辑器, text, rich_text, image
		// 单位px, for image.
		width: 0,
		height: 0,
		sortNum: { type : Number, default: 0 } ,
		modifyTime : { type : Date, default: Date.now } ,
	}],
	allowComment: { type: Boolean, default: false},
	sortNum: { type : Number, default: 10 } ,
	inusing : { type : Boolean, default: true } ,
	totalcount : { type : Number, default: 0 } ,//文章总数
	createTime : { type : Date, default: Date.now } ,
	modifyTime : { type : Date, default: Date.now } ,
});

mongoose.model('CATE', CateSchema);