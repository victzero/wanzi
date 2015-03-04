var fs = require('fs');
var path = require('path');
var config = require('../../config');

exports.upload = function(req, res) {
    var funcNum = req.query['CKEditorFuncNum'];
	var file = req.files && req.files.upload;
	if (!file || !file.size) {// error:修改时仍然是新增.
		res.end('图片上传失败,请联系管理员.','utf-8');
		return;
	}

	var tmp_path = file.path;
	var filename = Date.now() + '_' + file.name;

	var target_path = path.join(config.upload_img_dir, filename);

	fs.rename(tmp_path, target_path, function(err) {
		if (err) {
			throw err;
		}
		// 删除临时文件夹文件,
		fs.unlink(tmp_path, function() {
			if (err) {
				throw err;
			}

			var relativePath = config.relative_img_dir + filename;
			res.end("<script type=\"text/javascript\">window.parent.CKEDITOR.tools.callFunction("+ funcNum +", '"
					+ relativePath + "', '');</script>");    
		});
	});

}
