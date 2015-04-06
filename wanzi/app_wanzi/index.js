console.log('加载app_wanzi模块.')

exports.route = function(app){
	require('./routes-wanzi')(app)
}