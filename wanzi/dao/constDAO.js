var model = require('../model');
var mdao = model.Const;

/**
 * 根据主键获取
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.getById = function(id, callback) {
	mdao.findOne({
		_id: id
	}, callback);
};

/**
 * 根据指定属性获取记录.
 * @param  {[type]}   key [description]
 * @param  {[type]}   val [description]
 * @param  {Function} cb  [description]
 * @return {[type]}       [description]
 */
exports.getByProperty = function(query, cb) {
	mdao.findOne(query, cb)
}

/**
 * 物理删除
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.removeById = function(id, callback) {
	mdao.remove({
		_id: id
	}, callback);
}

/**
 * 逻辑删除
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.shutById = function(id, callback) {
	mdao.update({
		_id: id
	}, {
		inusing: false
	}, callback);
}

/**
 * 分页处理.
 * @param  {[type]}   query    [查询条件]
 * @param  {[type]}   filter   [过滤条件,默认inusing=true]
 * @param  {[type]}   fields   [返回参数,默认包含_id, modifyTime]
 * @param  {Function} callback [回调函数]
 * @return {[type]}            [description]
 */
exports.flip = function(query, filter, fields, callback) {
	var options = {
		skip: (filter.pageNo - 1) * filter.pageSize,
		limit: filter.pageSize,
		sort: {
			modifyTime: -1
		}
	}

	if (!query) {
		query = {};
	}
	query.inusing = true;

	mdao.count(query, function(err, count) {
		if (err) {
			throw err;
		}
		filter.totalCount = count;

		if (count != 0) {
			mdao.find(query, '_id modifyTime ' + fields,
				options,
				function(err, docs) {
					if (err) {
						throw err;
					}
					if (docs.length === 0) {
						return callback(null, []);
					}
					return callback(null, docs);

				});
		} else {
			return callback(null, []);
		}
	});
};

/**
 * 保存指定对象.
 * @param  {[type]}   obj [description]
 * @param  {Function} cb  [description]
 * @return {[type]}       [description]
 */
exports.save = function(obj, cb) {
	if (obj.id && obj.id != '') {
		exports.update(obj.id, obj, cb);
	} else {
		exports.create(obj, cb);
	}
}

/**
 * 新建
 * @param  {[type]}   temp [description]
 * @param  {Function} cb   [description]
 * @return {[type]}        [description]
 */
exports.create = function(temp, cb) {
	var entity = new mdao(temp);
	entity.save(cb);
}

/**
 * 更新
 * @param  {[type]}   id       [description]
 * @param  {[type]}   obj      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.update = function(id, obj, callback) {
	delete obj._id;
	mdao.update({
		_id: id
	}, obj, callback);
}

/********** 定制方法 ************/
exports.getVistorNum = function(cb) {
	exports.getByProperty({
		'name': 'VISTOR_NUM'
	}, function(err, obj) {
		if (err) {
			throw err;
		}
		// console.log(obj)
		if (!obj) {
			exports.save({
				name: 'VISTOR_NUM',
				constval: 1
			}, function() {
				cb(1)
			});
		} else {
			// console.log('und?:' + obj.constval)
			var cvl = parseInt(obj.constval) + 1;
			exports.update({
				_id: obj._id
			}, {
				constval: cvl
			}, function() {
				// console.log(cvl)
				cb(cvl)
			});
		}
	})
}


// getVistorNum(function(n){
// 	console.log(n)
// 	process.exit()
// })
