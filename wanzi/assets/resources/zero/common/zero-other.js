/**
 * ZERO-OTHER
 */
function zeroDeleteByJson(data, url, flipFormID){
	var msg = "确定删除该信息么?";
	if(!window.confirm(msg)){
		return;
	}
	$.ajax({
		type: 'get',
		url: url,
		data: data,
		dataType : 'json'
	}).done(function (){
		zeroAlert('删除成功');
		flipFormID && $(flipFormID).zeroFlip();
	}).fail(function (){
		zeroAlert("删除失败!");
	});
}

/**
 * 删除主控端.
 * 
 * @param id
 * @param url
 * @param cn
 * @param flipFormID
 */
function zeroDeleteOwner(id, url, cn, flipFormID){
	var data = {id: id };
	data = cn ? $.extend({}, data, {cn: cn}) : data;
	zeroDeleteByJson(data, url, flipFormID);
}

/**
 * 删除被控端
 * @param id
 * @param url
 * @param cn
 * @param ric
 * @param flipFormID
 */
function zeroDeleteMapped(id, url, cn, ric, flipFormID){
	var data = {id: id };
	data = cn ? $.extend({}, data, {cn: cn}) : data;
	data = ric ? $.extend({}, data, {ric: ric}) : data;
	zeroDeleteByJson(data, url, flipFormID);
}

function zeroDetailJson(data, callback){
	var back = callback && typeof(callback) === 'function' ? true : false;
	$.ajax({
		type: 'get',
		url: _zeroDetailURL,
		data: data,
		dataType : 'json'
	}).done(function(data){
		if(back){
			callback(data);
		}
	}).fail(function(){
		//zeroAlert("信息获取失败!");
		if(back){
			callback({'zeroError': '信息获取失败!'});
		}
	});
}

function zeroDetail(id, cn, callback){
	zeroDetailJson({'id': id, 'cn': cn}, callback);
}

function zeroBuildRel(id, callback){
	var back = callback && typeof(callback) === 'function' ? true : false;
	if(back){
		callback(id);
	}
}

function zeroAlert(msg){
//	alert(msg);
}

/**
 * 监听form表单的键盘enter事件.
 */
$(function(){
	$('form').each(function (){
		$(this).bind('keydown', function(e){
			if(e.keyCode == 13){ //keyboard enter.
				var $this = $(this), options, subBtn;
				if((subBtn = $this.find('[data-search]')).length){
					options = $.extend({}, subBtn.data());
					$this.zeroFlip(options);
				}else if((subBtn = $this.find('[data-coedit]')).length){
					options = $.extend({}, subBtn.data(), {type : 'MTO'});
					$this.zeroEdit(options);
				}else if((subBtn = $this.find('[data-credit]')).length){
					options = $.extend({}, subBtn.data(), {type : 'MTM'});
					$this.zeroEdit(options);
				}else if((subBtn = $this.find('[data-cedit]')).length){
					options = $.extend({}, subBtn.data(), {type : 'SELF'});
					$this.zeroEdit(options);
				}
				
				e.preventDefault();
			}
		});
	});
});
