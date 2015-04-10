var INIT_CONFIG = {
	//是否需要清空所有业务数据.只有在第一次部署时才可使用.
	clearBusinessData: false,
	admin: {
		name: 'asdf',
		alias: '系统管理员',
		pass: 'asdf'
	},
	bser: {
		name: 'xc',
		alias: '商家管理员',
		pass: '123456'
	},
	category: [
	// {
	// 	title: '礼包福利',
	// 	pathname: 'lbfl',
	// 	keyword: '礼包福利',
	// 	allowComment: false,
	// 	width: 200,
	// 	height: 100,
	// 	sortNum: 8,
	// 	fields: [{
	// 		name: 'yxq',
	// 		alias: '有效期',
	// 		type: 'String',
	// 		editor: 'text',
	// 		sortNum: 10
	// 	}, {
	// 		name: 'zl',
	// 		alias: '总量',
	// 		type: 'Number',
	// 		editor: 'text',
	// 		sortNum: 12
	// 	}, {
	// 		name: 'syl',
	// 		alias: '剩余量',
	// 		type: 'Number',
	// 		editor: 'text',
	// 		sortNum: 14
	// 	}, {
	// 		name: 'dhfs',
	// 		alias: '兑换方式',
	// 		type: 'String',
	// 		editor: 'text',
	// 		sortNum: 16
	// 	}]
	// },
	{
		title: '新闻-焦点图',
		pathname: 'xw_jdt',
		keyword: '新闻',
		allowComment: false,
		width: 200,
		height: 100,
		sortNum: 10,
	}, {
		title: '评测-焦点图',
		pathname: 'pc_jdt',
		keyword: '评测',
		allowComment: false,
		width: 200,
		height: 100,
		sortNum: 20,
	}, {
		title: '专题-焦点图',
		pathname: 'zt_jdt',
		keyword: '专题',
		allowComment: false,
		width: 200,
		height: 100,
		sortNum: 30,
	}, {
		title: '干货-焦点图',
		pathname: 'gh_jdt',
		keyword: '干货',
		allowComment: false,
		width: 200,
		height: 100,
		sortNum: 40,
	}, {
		title: '新闻',
		pathname: 'xw',
		keyword: '新闻',
		allowComment: true,
		sortNum: 12,
		fields: [{
			name: 'fbr',
			alias: '发布人',
			type: 'String',
			editor: 'text',
			sortNum: 10
		}, {
			name: 'fbrms',
			alias: '发布人描述',
			type: 'String',
			editor: 'text',
			sortNum: 12
		}, {
			name: 'fxdz',
			alias: '分享地址',
			type: 'String',
			editor: 'text',
			sortNum: 14
		}, {
			name: 'ydcs',
			alias: '阅读次数设置',
			type: 'String',
			editor: 'text',
			sortNum: 16
		}]
	}, {
		title: '评测',
		pathname: 'pc',
		keyword: '评测',
		allowComment: true,
		sortNum: 22,
		fields: [{
			name: 'fbr',
			alias: '发布人',
			type: 'String',
			editor: 'text',
			sortNum: 10
		}, {
			name: 'fbrms',
			alias: '发布人描述',
			type: 'String',
			editor: 'text',
			sortNum: 12
		}, {
			name: 'fxdz',
			alias: '分享地址',
			type: 'String',
			editor: 'text',
			sortNum: 14
		}, {
			name: 'ydcs',
			alias: '阅读次数设置',
			type: 'String',
			editor: 'text',
			sortNum: 16
		}]
	}, {
		title: '专题',
		pathname: 'zt',
		keyword: '专题',
		allowComment: true,
		sortNum: 32,
		fields: [{
			name: 'fbr',
			alias: '发布人',
			type: 'String',
			editor: 'text',
			sortNum: 10
		}, {
			name: 'fbrms',
			alias: '发布人描述',
			type: 'String',
			editor: 'text',
			sortNum: 12
		}, {
			name: 'fxdz',
			alias: '分享地址',
			type: 'String',
			editor: 'text',
			sortNum: 14
		}, {
			name: 'ydcs',
			alias: '阅读次数设置',
			type: 'String',
			editor: 'text',
			sortNum: 16
		}]
	}, {
		title: '干货',
		pathname: 'gh',
		keyword: '干货',
		allowComment: true,
		sortNum: 42,
		fields: [{
			name: 'fbr',
			alias: '发布人',
			type: 'String',
			editor: 'text',
			sortNum: 10
		}, {
			name: 'fbrms',
			alias: '发布人描述',
			type: 'String',
			editor: 'text',
			sortNum: 12
		}, {
			name: 'fxdz',
			alias: '分享地址',
			type: 'String',
			editor: 'text',
			sortNum: 14
		}, {
			name: 'ydcs',
			alias: '阅读次数设置',
			type: 'String',
			editor: 'text',
			sortNum: 16
		}]
	}]
}
exports.config = INIT_CONFIG;