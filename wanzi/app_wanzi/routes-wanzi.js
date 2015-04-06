var url = require('url');
var path = require('path');
var express = require('express');

var config = require('../config');

var ctrlHome = './controllers/';

function render(res, view, data){
	res.render('../app_wanzi/views/' + view, data);
}

module.exports = function(app){
	console.log('加载app_wanzi路由.')
	//静态文件
	app.use('/static', express.static(path.join(__dirname, 'assets')))

	//动态地址
app.get('/', function(req, res) {
	render(res, 'preferred', {
		bannerurl: '/static/modules/img/pref_banner.jpg',
		guquan: [{
			id: 123,
			img: "/static/modules/img/pref_01.jpg",
			title: "丸子保你赚理财 全场最高收益1",
			desc: "稳健安全 收益高  风险小",
			highest: "7%",
			starting: "1000"
		}, {
			id: 123,
			img: "/static/modules/img/pref_02.jpg",
			title: "丸子保你赚理财 全场最高收益2",
			desc: "稳健安全 收益高  风险小",
			highest: "7%",
			starting: "1000"
		}, {
			id: 123,
			img: "/static/modules/img/pref_03.jpg",
			title: "丸子保你赚理财 全场最高收益3",
			desc: "稳健安全 收益高  风险小",
			highest: "7%",
			starting: "1000"
		}, {
			id: 123,
			img: "/static/modules/img/pref_04.jpg",
			title: "丸子保你赚理财 全场最高收益4",
			desc: "稳健安全 收益高  风险小",
			highest: "7%",
			starting: "1000"
		}],
		shiwu: [{
			id: 123,
			img: "/static/modules/img/pref_05.jpg",
			title: "丸子保你赚理财 全场最高收益",
			desc: "稳健安全 收益高  风险小",
			highest: "7%",
			starting: "1000"
		}, {
			id: 123,
			img: "/static/modules/img/pref_06.jpg",
			title: "丸子保你赚理财 全场最高收益",
			desc: "稳健安全 收益高  风险小",
			highest: "7%",
			starting: "1000"
		}, {
			id: 123,
			img: "/static/modules/img/pref_07.jpg",
			title: "丸子保你赚理财 全场最高收益",
			desc: "稳健安全 收益高  风险小",
			highest: "7%",
			starting: "1000"
		}, {
			id: 123,
			img: "/static/modules/img/pref_08.jpg",
			title: "丸子保你赚理财 全场最高收益",
			desc: "稳健安全 收益高  风险小",
			highest: "7%",
			starting: "1000"
		}],
		licai: [{
			id: 123,
			img: "/static/modules/img/pref_09.jpg",
			title: "丸子保你赚理财 全场最高收益",
			desc: "稳健安全 收益高  风险小",
			highest: "7%",
			starting: "1000"
		}, {
			id: 123,
			img: "/static/modules/img/pref_10.jpg",
			title: "丸子保你赚理财 全场最高收益",
			desc: "稳健安全 收益高  风险小",
			highest: "7%",
			starting: "1000"
		}, {
			id: 123,
			img: "/static/modules/img/pref_11.jpg",
			title: "丸子保你赚理财 全场最高收益",
			desc: "稳健安全 收益高  风险小",
			highest: "7%",
			starting: "1000"
		}, {
			id: 123,
			img: "/static/modules/img/pref_12.jpg",
			title: "丸子保你赚理财 全场最高收益",
			desc: "稳健安全 收益高  风险小",
			highest: "7%",
			starting: "1000"
		}],
		juanzeng: [{
			id: 123,
			img: "/static/modules/img/pref_13.jpg",
			title: "丸子保你赚理财 全场最高收益",
			desc: "稳健安全 收益高  风险小",
			highest: "7%",
			starting: "1000"
		}, {
			id: 123,
			img: "/static/modules/img/pref_14.jpg",
			title: "丸子保你赚理财 全场最高收益",
			desc: "稳健安全 收益高  风险小",
			highest: "7%",
			starting: "1000"
		}, {
			id: 123,
			img: "/static/modules/img/pref_15.jpg",
			title: "丸子保你赚理财 全场最高收益",
			desc: "稳健安全 收益高  风险小",
			highest: "7%",
			starting: "1000"
		}, {
			id: 159,
			img: "/static/modules/img/pref_16.jpg",
			title: "全场最高收益",
			desc: "稳健安全 收益高  风险小",
			highest: "27%",
			starting: "1000"
		}]


	})
});
app.get('/market', function(req, res) {
	render(res, 'market', {
		pageNum: 12, 
		totalPage: 18,
		results: [{
			id: "123", 
			title: "湖北武汉担保（先息后本）", 
			img:"/static/modules/img/market_02.jpg",
			province:"湖北",
			company: "建筑装饰工程企业", 
			progress: 50, 
			current: "2,000,000", 
			total: "200", 
			desc: "公司成立于2003年，注册资本1800万元。经营范围为室内外建围为室内外建建围为室内外建建围为室内外建", 
			rate: "9%",
			term: "1.5", 
		},{
			id: "123", 
			title: "湖北武汉担保（先息后本）", 
			img:"/static/modules/img/market_03.jpg",
			province:"湖北",
			company: "建筑装饰工程企业", 
			progress: 60, 
			current: "2,000,000", 
			total: "200", 
			desc: "公司成立于2003年，注册资本1800万元。经营范围为室内外建围为室内外建建围为室内外建建围为室内外建", 
			rate: "9%",
			term: "1.5", 
		},{
			id: "123", 
			title: "湖北武汉担保（先息后本）", 
			img:"/static/modules/img/market_04.jpg",
			province:"湖北",
			company: "建筑装饰工程企业", 
			progress: 80, 
			current: "2,000,000", 
			total: "200", 
			desc: "公司成立于2003年，注册资本1800万元。经营范围为室内外建围为室内外建建围为室内外建建围为室内外建", 
			rate: "9%",
			term: "1.5", 
		},{
			id: "123", 
			title: "湖北武汉担保（先息后本）", 
			img:"/static/modules/img/market_05.jpg",
			province:"湖北",
			company: "建筑装饰工程企业", 
			progress: 20, 
			current: "2,000,000", 
			total: "200", 
			desc: "公司成立于2003年，注册资本1800万元。经营范围为室内外建围为室内外建建围为室内外建建围为室内外建", 
			rate: "9%",
			term: "1.5", 
		},{
			id: "123", 
			title: "湖北武汉担保（先息后本）", 
			img:"/static/modules/img/market_06.jpg",
			province:"湖北",
			company: "建筑装饰工程企业", 
			progress: 100, 
			current: "2,000,000", 
			total: "200", 
			desc: "公司成立于2003年，注册资本1800万元。经营范围为室内外建围为室内外建建围为室内外建建围为室内外建", 
			rate: "9%",
			term: "1.5", 
		},{
			id: "123", 
			title: "湖北武汉担保（先息后本）", 
			img:"/static/modules/img/market_07.jpg",
			province:"湖北",
			company: "建筑装饰工程企业", 
			progress: 100, 
			current: "2,000,000", 
			total: "200", 
			desc: "公司成立于2003年，注册资本1800万元。经营范围为室内外建围为室内外建建围为室内外建建围为室内外建", 
			rate: "9%",
			term: "1.5", 
		}]
	})
});
app.get('/know', function(req, res) {
	render(res, 'know', {
		guquan: {
			desc: "首当其中就是债权众筹（P2P公司），即双方为借贷关系，顾名思义Peer to peer就是端对端使资金更加简单垂直化，给予人或者组织资金帮助，同时使众多投资人得到回馈，当项目完成或有阶段成果时，须向投资者返还所借款项(可加入利息)。其次就是一些票据理财（基于票据类），基金公司的基金众筹，保险类理财众筹等等。"
		},
		shiwu: {
			desc: "在项目完成后给予投资人一定形式的回馈品或纪念品。回馈品大多是项目完成后的产品。时常基于投资人对于项目产品的优惠券和预售优先权。如各类食品，科技类产品，演唱会门票等等。"
		},
		licai: {
			desc: "此种模式与股权投资类似，即投资者投入资金后可以得到新创公司的股份，或其他具有股权性质的衍生工具。股权模式又衍生了很多形式的融资，有的是新创公司融资，而有的是实体店铺开分店融资(相对其他的股权融资平台上的电信、媒体和科技行业，大大降低了投资人的风险)。"
		},
		juanzeng: {
			desc: "单纯的赠与行为，即无需向投资者提供任何形式的回馈。投资人更多地是考虑创意项目带来的心理满足感。以及慈善类的捐助，帮助特定的人群达到特定的目的。"
		},
	})
});
app.get('/about', function(req, res) {
	render(res, 'about', {
		person: [{
				Img: "/static/modules/img/aboout_02.jpg", 
				Name: "朱劲松", 
				Desc: "毕业于北京信息科技大学，参与过二十多个互联网项目的研发，主要负责系统架构的设计与实现，现就职于华北计算技术研究所，从事网站架构设计、优化，同时为在线可视化数据分析提供解决方案。" 
			},{
				Img: "/static/modules/img/aboout_03.jpg", 
				Name: "朱劲松", 
				Desc: "毕业于北京信息科技大学，参与过二十多个互联网项目的研发，主要负责系统架构的设计与实现，现就职于华北计算技术研究所，从事网站架构设计、优化，同时为在线可视化数据分析提供解决方案。" 
			},{
				Img: "/static/modules/img/aboout_04.jpg", 
				Name: "肖明岳", 
				Desc: "90后，纽约州州立大学金融学硕士，对于crowd fund这种新兴的互联网金融具有浓厚的兴趣，曾参与纽约州立大学资金池管理。" 
			}
		]
	})
});
app.get('/jump', function(req, res) {
	render(res, 'jump', {
		aa: '123'
	})
});
}

