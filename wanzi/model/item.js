var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config').config;

var ItemSchema = new Schema({
	title : {//项目名称.
		type : String,
		index : true,
	},
	keyword : {//关键字
		type : String,
	},
	description : {//描述
		type : String,
	},
	img : String,//图片地址
	imgalt : String,//图片描述
	status : String,//当前状态
	iterestRate : String,//年化利率
	duration : String,//持续时间
	amount : String,//融资金额
	urlAddress : String,//抓取网址
	createTime : { type : Date, default: Date.now } ,
	modifyTime : { type : Date, default: Date.now } ,
});

mongoose.model('ITEM', ItemSchema);