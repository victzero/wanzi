/**
 * api文档导出工具.
 * 1.固定地址的基本接口.
 * 2.动态地址的接口.
 * 	a.文章列表接口
 * 	b.文章详情接口
 * 	c.文章评论接口
 */
var fs = require('fs');
var async = require('async');
var cateDAO = require('../../dao/cateDAO');

var STR_ARR = [];

function append(str) {
	console.log(str);
	STR_ARR.push(str);
}

async.series([
	function(cb) { //准备数据--大纲
		append('前端api文档.');
		append('1.固定地址的基本接口.');
		append('2.动态地址的接口.');
		append('  a.文章列表接口');
		append('  b.文章详情接口');
		append('  c.文章评论接口');
		append('');
		append('');
		append('---------------------------');
		append('');
		append('');
		append('1.固定地址');
		//TODO
		append('2.动态地址');
		append('  a.文章列表接口');
		cb();
	},
	function(cb) { //准备数据
		cateDAO.list({}, 'title pathname', function(err, list) {
			if (err) {
				throw err;
			}
			append('');
			for (var i = 0; i < list.length; i++) {
				var obj = list[i];
				append('"' + obj.title + '"分页接口')
				append('URL:' + '/topic/list/' + obj.pathname)
				append('Method:' + 'GET, POST')
				append('arguments:');
				append('        |pageNo   页码');
				append('        |s_title  标题,模糊检索');
				append('');
				append('return:')
				append('        |json数据:');
				append('        |{');
				append('        |	code: 代码,200表示请求成功,负数表示请求有误');
				append('        |	mess: code<0时有值,表示错误描述');
				append('        |	title: 类别标题');
				append('        |	list: [] 数组');
				append('        |	filter: 分页信息');
				append('        |}');
				append('');
				append('---------------------------');

				append('"' + obj.title + '"详情接口')
				append('URL:' + '/topic/detail/' + obj.pathname)
				append('Method:' + 'GET')
				append('arguments:');
				append('        |id       主键');
				append('');
				append('return:')
				append('        |json数据:');
				append('        |{');
				append('        |	code: 代码,200表示请求成功,负数表示请求有误');
				append('        |	mess: code<0时有值,表示错误描述');
				append('        |	title: 标题');
				append('        |	topic: 文章对象(JSON)');
				append('        |}');
				append('');
				append('---------------------------');
			};
			cb();
		});
	},
	function(cb) { //准备数据
		append('');
		append('评论接口');
		append('URL:' + '/topic/comment/edit')
		append('Method:' + 'GET, POST')
		append('arguments:');
		append('        |title         评论标题');
		append('        |content       评论内容');
		append('        |targetType    评论的目标类型, 1表示文章主题, 2表示评论');
		append('        |topicID       评论的topic主键(必填)');
		append('        |commentID     评论的主键(targetType=1时无效)');

		append('');
		append('return:')
		append('        |json数据:');
		append('        |{');
		append('        |	code: 代码,200表示请求成功,负数表示请求有误');
		append('        |	mess: 描述信息');
		append('        |}');
		append('');
		append('---------------------------');
		cb();
	},
	function(cb) { //准备数据
		cb();
	},
	function(cb) { //写文件
		var stream = fs.createWriteStream("api文档.txt");
		stream.once('open', function(fd) {
			stream.write(STR_ARR.join('\n'));
			stream.end();

			console.log('end')
			process.exit();
		});
	},
]);