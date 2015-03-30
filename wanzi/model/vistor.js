/**
 * vistor user,访客
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config').config;

var schema = new Schema({
	name: { //登录名
		type: String,
		index: true,
		unique: true
	},
	machineCode: { //机器码
		type: String,
	},
	aliasname: { //昵称
		type: String,
	},
	password: String, //密码
	inusing: { //是否禁用
		type: Boolean,
		default: true
	},
	type: {//用户类型, 0:临时用户, 1:网页用户, 2:app用户, 3:正式用户(有密码)
		type: Number,
		default: 0
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

mongoose.model('VISTOR', schema);