var fs = require('fs');
var path = require('path');
var sys = require('sys');
var config = require('../../config');
var itemDAO = require('../../dao').ItemDAO;
var tacticsDAO = require('../../dao').TacticsDAO;
var fetchService = require('../../service/fetchData/jimuBox');

var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;
var extend = require('zero').extend;

var rootCate = {
	navID_jimubox: '61',
	navID_tactics: '62',
}

//各个网站抓取策略查看页面.
exports.tacticsList = function(req, res) {
	var filter = new FlipFilter(req.body.filter);

	tacticsDAO.flip(filter, function(err, list) {
		if (err) {
			throw err;
		}
		var cons = {
			name: '策略信息'
		}
		extend(cons, rootCate);
		res.render('admin/fetchData/tactics_list', {
			title: '策略信息',
			list: list,
			fmt: fmt,
			cons: cons,
			filter: filter.init()
		});
	})
}

var JIMUBOX_UPDATE_INTERVAL = null;
/**
 * 设置积木盒子的更新策略.
 */
exports.jimubox_interval = function(req, res){
	var interval = req.query['interval'];
	if(!interval){
		res.redirect('/admin/fetchData/jimuBox');
	}else{
		interval = interval * 1000;
	}
	if(JIMUBOX_UPDATE_INTERVAL){
		clearInterval(JIMUBOX_UPDATE_INTERVAL)
	}
	JIMUBOX_UPDATE_INTERVAL = setInterval(function(){
		fetchService.updateList();
	}, interval);
	res.redirect('/admin/fetchData/jimuBox');
}

/**
 * 查看所有积木盒子的数据
 */
exports.jimubox_list = function(req, res) {
	var stitle = req.query['s_title'] || req.body['s_title'];

	var filter = new FlipFilter(req.body.filter);

	if (stitle) {
		filter.title = stitle;
	}
	itemDAO.flip(filter, function(err, list) {
		if (err) {
			throw err;
		}

		var cons = {
			name: '积木盒子'
		};
		extend(cons, rootCate);
		res.render('admin/fetchData/jimubox_list', {
			title: '管理',
			list: list,
			fmt: fmt,
			s_title: stitle,
			cons: cons,
			filter: filter.init()
		});
	});
}

exports.jimubox_update = function(req, res) {
	fetchService.updateList();
	res.redirect('/admin/fetchData/jimuBox');
}