var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 策略信息.
 * 属性:
 * 1. title: 显示名称
 * 2. reg: 正则表达式,有可能需要多个组合使用.
 */
var TacticsSchema = new Schema({
	title : {
		type : String,
		index : true
	},
	reg : String,
	createTime : { type : Date, default: Date.now } ,
	modifyTime : { type : Date, default: Date.now } ,
});

mongoose.model('TACTICS', TacticsSchema);