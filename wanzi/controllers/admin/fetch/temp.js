var fs = require('fs');
var path = require('path');
var sys = require('sys');
var http = require('http');
var url = require('url');
var zlib = require('zlib');
var zero = require('zero');
var config = require('../../../config');
var itemDAO = require('../../../dao').ItemDAO;
var tacticsDAO = require('../../../dao').TacticsDAO;

var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;
var extend = require('zero').extend;

var rootCate = {
	navID_temp: '63',
}

//展示抓取页面.
exports.fetchPage = function(req, res) {
	var cons = {
		name: 'temp'
	}
	extend(cons, rootCate);
	res.render('admin/fetchData/fetch_temp', {
		title: 'temp',
		fmt: fmt,
		cons: cons,
	});
}

exports.fetchURL = function(req, res) {
	var urlAddress = req.query['url'];
	var index = urlAddress.indexOf('/');
	var requestOptions = {
	    host: urlAddress.substring(0, index),
	    port: 80,
	    path: urlAddress.substring(index)
	};
	http.get(requestOptions, function(response) {
		if (response.statusCode != 200) {
			console.error("Initial stack was not found");
			res.end('error', 'utf-8');
			return;
		}
		var stack = '';
		response.on('data', function(chunk) {
			stack += chunk;
		});
		response.on('end', function() {
			var match = null;
			var packages = [];
			//			 console.log(stack);
			res.end(stack, 'utf-8');
		});
	}).on('error', function(e) {
		res.end('error', 'utf-8');
	});

}