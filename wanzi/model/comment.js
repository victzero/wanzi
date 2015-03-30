/**
 * 评论表
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config').config;

var schema = new Schema({
	title: { //评论标题
		type: String,
	},
	content: { //评论内容
		type: String,
	},
	vistorName: { //评论人昵称
		type: String,
	},
	vistorId: { //评论人主键
		type: String,
	},
	topicID: {// 所属文章主键
		type: String,
	},

	num_zan: { type : Number, default: 0 } ,//赞
	num_cai: { type : Number, default: 0 } ,//踩

	parent: { type: String, ref: 'COMMENT' },//自关联

	inusing: { //是否屏蔽
		type: Boolean,
		default: true
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

mongoose.model('COMMENT', schema);