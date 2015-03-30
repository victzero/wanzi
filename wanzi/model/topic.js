var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config').config;

/**
 * 文章表
 * @type {Schema}
 */
var TopicSchema = new Schema({
	title: { //标题
		type: String,
		index: true,
	},
	keyword: { //关键字
		type: String,
	},
	description: { //描述
		type: String,
	},
	
	num_zan: { type : Number, default: 0 } ,//赞
	num_cai: { type : Number, default: 0 } ,//踩
	num_comment: { type : Number, default: 0 } ,//评论数
	num_read: { type : Number, default: 0},//阅读次数

	img: String, //图片相对地址
	imgalt: String, //图片提示信息
	realpath: String, //图片真实路径
	category: String, //所属分类
	content: String, //内容.
	createTime: {
		type: Date,
		default: Date.now
	},
	modifyTime: {
		type: Date,
		default: Date.now
	},
});

mongoose.model('TOPIC', TopicSchema);