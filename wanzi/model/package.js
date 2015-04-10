var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config').config;

/**
 * 礼包
 * @type {Schema}
 */
var PackageSchema = new Schema({
	title: { //标题
		type: String,
		index: true,
	},
	keyword: { //关键字
		type: String,
	},
	description: { //简单描述
		type: String,
	},

	yxq: String, //有效期
	zl: {
		type: Number,
		default: 0
	}, //总量
	syl: {
		type: Number,
		default: 0
	}, //剩余量
	dhfs: String, //兑换方式
	content: String, //详细描述.

	img: String, //图片相对地址
	imgalt: String, //图片提示信息
	realpath: String, //图片真实路径

	inusing : { type : Boolean, default: true } ,

	createTime: {
		type: Date,
		default: Date.now
	},
	modifyTime: {
		type: Date,
		default: Date.now
	},
});

mongoose.model('PACKAGE', PackageSchema);