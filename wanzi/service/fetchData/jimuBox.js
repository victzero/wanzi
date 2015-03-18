var http = require('http');
var url = require('url');
var fs = require('fs');
var zlib = require('zlib');
var zero = require('zero');
var itemDAO = require('../../dao').ItemDAO;
var locRegex = new RegExp("<h4 class=\"project-name\">(.*?)</h4>", "gi");
var titleRegex = new RegExp("<a href=\"(.*)\" class=\"black-link\"", "gi");
var detailRegex = new RegExp("data-html=\"true\">([\u4e00-\u9fa5]*)</span>\n(.*)</h2>", 'gi');
var detailDescRegex = new RegExp("<p style=\"margin-bottom: 0; font-size:12px\" class=\"\">\n(.*)\n", "gi");
var detailProgressRegex = new RegExp('value=\"([0-9]*)\"/>', "gi");
var detailRateRegex = new RegExp("<span class=\"important\">\n(.*)</span>", "gi");
var detailTimeRegex = new RegExp("(.*)<span class=\"unit\">([\u4e00-\u9fa5]*)</span>", "gi");
var detailMoneyRegex = new RegExp("(.*)<span\n.*class=\"unit\">(.*)</span>", "gi");
/*
 * Starting Link
 */
var baseOptions = {
    host: 'www.jimubox.com',
    port: 80,
};
var totalIndex = 1;

exports.updateList = updateList = function() {
    for (var i = 1; i <= 2; i++) {
        processPage(i);
    }
}

//updateList();

function processPage(page) {
    //状态为正在进行
    baseOptions.path = '/Project/List?status=1&page=' + page;
    http.get(baseOptions, function(response) {
        if (response.statusCode != 200) {
            console.error("Initial stack was not found");
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
            while (match = titleRegex.exec(stack)) {
                packages.push(match[1]);
            }
            processPackages(page, packages);
        });
    }).on('error', function(e) {
        console.log("Got error<getting base>: " + e.message);
    });
}

var processPackages = function(page, packages) {
	var totalPackages = packages.length;
	for (var i = 0; i < packages.length; i++) {
		var urlAddress = packages[i];
		// console.log(urlAddress);
		if (zero.util.startWith(urlAddress, '/Project/Index')) {
			// console.log('index');
			processIndex(urlAddress);
		} else if (zero.util.startWith(urlAddress, '/Project/ProjectSet')) {
			// console.log('ProjectSet')
		}
	}
}

exports.processIndex = processIndex = function(urlAddress) {
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
			console.log(totalIndex++ + '----------');
			var temp = {};
			while (match = detailRegex.exec(stack)) {
				temp.title = match[1] + match[2];
				console.log("项目名称:" + match[1] + match[2]);
			}
			while (match = detailProgressRegex.exec(stack)) {
				temp.progress = match[1];
				console.log("当前进度:" + match[1]);
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
			itemDAO.newAndSave(temp);
		});

		// response.pipe(zlib.createGunzip()).pipe(
		// fs
		// .createWriteStream("./data/segment_" + index
		// + ".txt"));
		// console.log("Piping " + index + " of " + totalPackages *
		// index
		// + " into ./data/segment_" + index + ".txt");
	}).on('error', function(e) {
		console.log("Got error<getting packages>: " + e.message);
	});
}