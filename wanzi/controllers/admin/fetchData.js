var fs = require('fs');
var path = require('path');
var sys = require('sys');
var config = require('../../config');
var topicDAO = require('../../dao').TopicDAO;
var cateDAO = require('../../dao').CateDAO;
var fmt = require('zero').fmt;
var FlipFilter = require('zero').FlipFilter;
var extend = require('zero').extend;

var rootCate = {
	navID_jimubox : '61',
}

/**
 * 查看所有积木盒子的数据
 */
exports.jimubox_list = function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}
