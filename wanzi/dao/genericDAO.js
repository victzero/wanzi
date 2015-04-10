var zutil = require('zero').util;

var genericDAO = zutil.createClass({
	mdao: null,

	/**
	 * Constructor
	 */
	initialize: function(dao) {
		mdao = dao;
	},

	/**
	 * 根据主键获取
	 * @param  {[type]}   id       [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	getById: function(id, callback) {
		mdao.findOne({
			_id: id
		}, callback);
	},

	/**
	 * 根据指定属性获取记录.
	 * @param  {[type]}   key [description]
	 * @param  {[type]}   val [description]
	 * @param  {Function} cb  [description]
	 * @return {[type]}       [description]
	 */
	getByProperty: function(query, cb) {
		mdao.findOne(query, cb)
	},

	/**
	 * 物理删除
	 * @param  {[type]}   id       [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	removeById: function(id, callback) {
		mdao.remove({
			_id: id
		}, callback);
	},

	/**
	 * 逻辑删除
	 * @param  {[type]}   id       [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	shutById: function(id, callback) {
		mdao.update({
			_id: id
		}, {
			inusing: false
		}, callback);
	},

	/**
	 * 全量查询, listAll
	 * @param  {[type]}   query    [description]
	 * @param  {[type]}   fields   [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	list: function(query, fields, callback) {
		var options = {
			limit: 100,
		}
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
	},

	/**
	 * 分页处理.
	 * @param  {[type]}   query    [查询条件]
	 * @param  {[type]}   filter   [过滤条件,默认inusing=true]
	 * @param  {[type]}   fields   [返回参数,默认包含_id, modifyTime]
	 * @param  {Function} callback [回调函数]
	 * @return {[type]}            [description]
	 */
	flip: function(query, filter, fields, callback) {
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
	},

	/**
	 * 保存指定对象.
	 * @param  {[type]}   obj [description]
	 * @param  {Function} cb  [description]
	 * @return {[type]}       [description]
	 */
	save: function(obj, cb) {
		if (obj._id && obj._id != '') {
			this.update(obj._id, obj, cb);
		} else {
			this.create(obj, cb);
		}
	},

	/**
	 * 新建
	 * @param  {[type]}   temp [description]
	 * @param  {Function} cb   [description]
	 * @return {[type]}        [description]
	 */
	create: function(temp, cb) {
		delete temp._id;
		var entity = new mdao(temp);
		entity.save(cb);
	},

	/**
	 * 更新
	 * @param  {[type]}   id       [description]
	 * @param  {[type]}   obj      [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	update: function(id, obj, callback) {
		delete obj._id;
		mdao.update({
			_id: id
		}, obj, callback);
	},
});



exports.gDAO = genericDAO;

// exports.extend = function(exp) {
// 	for (var key in genericDAO) {
// 		exp[key] = genericDAO[key]
// 	}
// 	return exp;
// }