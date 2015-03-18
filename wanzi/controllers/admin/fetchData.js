var fs = require('fs');
var path = require('path');
var sys = require('sys');
var http = require('http');
var url = require('url');
var config = require('../../config');
var itemDAO = require('../../dao').ItemDAO;
var tacticsDAO = require('../../dao').TacticsDAO;
var fetchService = require('../../service/fetchData/jimuBox');

var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;
var extend = require('zero').extend;

var locRegex = new RegExp("<h4 class=\"project-name\">(.*?)</h4>", "gi");
var titleRegex = new RegExp("<a href=\"(.*)\" class=\"black-link\"", "gi");
var detailRegex = new RegExp("data-html=\"true\">([\u4e00-\u9fa5]*)</span>\n(.*)</h2>", 'gi');
var detailDescRegex = new RegExp("<p style=\"margin-bottom: 0; font-size:12px\" class=\"\">\n(.*)\n", "gi");
var detailProgressRegex = new RegExp('value=\"([0-9]*)\"/>', "gi");
var detailRateRegex = new RegExp("<span class=\"important\">\n(.*)</span>", "gi");
var detailTimeRegex = new RegExp("(.*)<span class=\"unit\">([\u4e00-\u9fa5]*)</span>", "gi");
var detailMoneyRegex = new RegExp("(.*)<span\n.*class=\"unit\">(.*)</span>", "gi");

var rootCate = {
	navID_jimubox: '61',
	navID_tactics: '62',
	navID_temp: '63',
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
exports.jimubox_interval = function(req, res) {
	var interval = req.query['interval'];
	if (!interval) {
		res.redirect('/admin/fetchData/jimuBox');
	} else {
		interval = interval * 1000;
	}
	if (JIMUBOX_UPDATE_INTERVAL) {
		clearInterval(JIMUBOX_UPDATE_INTERVAL)
	}
	JIMUBOX_UPDATE_INTERVAL = setInterval(function() {
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

//更新已有项目.
exports.jimubox_detail_update = jimubox_detail_update = function(req, res) {
	itemDAO.listUnfinished(null, function(err, list) {
		if (err) {
			throw err;
		}
		for (var index in list) {
			var item = list[index];
			var id = item._id;
			var uri = item.urlAddress;
			processUrl(id, uri);
		}
		res.redirect('/admin/fetchData/jimuBox');
	});
}


var JIMUBOX_DETAIL_UPDATE_INTERVAL = null;
//定时更新已有项目.
exports.jimubox_detail_interval = function(req, res) {
	var interval = req.query['interval'];
	console.log('?:' + res);
	if (!interval) {
		res.redirect('/admin/fetchData/jimuBox');
	} else {
		interval = interval * 1000;
	}
	if (JIMUBOX_DETAIL_UPDATE_INTERVAL) {
		clearInterval(JIMUBOX_DETAIL_UPDATE_INTERVAL)
	}
	JIMUBOX_DETAIL_UPDATE_INTERVAL = setInterval(function() {
		itemDAO.listUnfinished(null, function(err, list) {
			if (err) {
				throw err;
			}
			for (var index in list) {
				var item = list[index];
				var id = item._id;
				var uri = item.urlAddress;
				processUrl(id, uri);
			}
		});
	}, interval);
	res.redirect('/admin/fetchData/jimuBox');
}

function processUrl(id, urlAddress) {
	var requestOptions = url.parse(urlAddress);
	requestOptions.host = 'www.jimubox.com';
	requestOptions.port = 80;
	http.get(requestOptions, function(response) {
		if (response.statusCode != 200) {
			console.log("failed to get package form google");
			return;
		}
		var stack = '';
		response.on('data', function(chunk) {
			stack += chunk;
		});

		response.on('end', function() {
			var match = null;
			// console.log(stack);
			var temp = {};
			console.log('---------' + urlAddress + '----------');
			while (match = detailRegex.exec(stack)) {
				temp.title = match[1] + match[2];
				console.log("项目名称:" + match[1] + match[2]);
			}
			var finished = true;
			while (match = detailProgressRegex.exec(stack)) {
				temp.progress = match[1];
				finished = false;
				console.log("当前进度:" + match[1]);
			}
			if (finished == true) {
				temp.progress = '100';
				console.log("当前进度:" + '已结束');
			}
			//			temp.status = '投标中';
			while (match = detailRateRegex.exec(stack)) {
				temp.iterestRate = match[1].replace('<small>+</small>', '+') + "%";
				console.log("年化利率:" + match[1].replace('<small>+</small>', '+') + "%");
			}
			while (match = detailTimeRegex.exec(stack)) {
				temp.duration = match[1] + match[2];
				console.log("时间:" + match[1] + match[2]);
			}
			while (match = detailMoneyRegex.exec(stack)) {
				temp.amount = match[1] + match[2];
				console.log("融资金额" + match[1] + match[2]);
			}
			temp.urlAddress = urlAddress;
			itemDAO.update(id, temp, function(err, count) {
				if (err) {
					throw err;
				}
			});
		});

	}).on('error', function(e) {
		console.log("Got error<getting packages>: " + e.message);
	});
}