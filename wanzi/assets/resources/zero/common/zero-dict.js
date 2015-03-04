/**
 * ZERO-DICT
 */
!function ($){
	
	/* CLASS DEFINITION */
	
	var ZeroDict = function(element, options){
		this.$form = $(element); // form表单
		this.element = element;
		this.options = options;
		this.inited = false;
	};
	
	ZeroDict.prototype = {
		init : function(){
			this.formData = new zFormData();
			var thisfd = this.formData;
			var op = this.options;
			op.dictval && thisfd.append("s['parent.value_EQ'].begin",op.dictval);
			//op.dictid && thisfd.append('parentID',op.dictid);
			if(!this.inited){
				this.inited = true;
			}
			return this;
		},
		setDictID : function(dictid){
			this.options.dictid = dictid;
		},
		setDictVal : function(dictval){
			this.options.dictval = dictval;
		},
		setValByID : function(dictid){
			var $this = $(this.element);
			var id = "";
			var val = this.options.defaultval;
			if(this.options.style == 'option'){
				$this.find('option').each(function(){
					if($(this).val() == dictid){
						$(this).attr('selected','selected');
					};
				});
			}else{
				$('ul li a', $this).each(function(){
					var finded = $(this).data().dictid == dictid;
					val = finded ? $(this).html() : val;
					id = finded ? dictid : '';
				});
				$this.find('input[type=hidden]').val(id);
				$this.find('button').html(val + ' <span class="caret">');
			}
			
		},
		//提交
		submit : function(){
			this.init();
			var _this = this;
			var op = this.options;
			var $this = $(this.element);
			$.ajax({
				type : op.method,
				url : op.action,
				data : this.formData.toString(),
				dataType : 'text'
			}).then(function(data) {
				if(op.style == 'option'){
					$this.html(data);
					if(op.showid){
						_this.setValByID(op.showid);
						if(op.next){
							$(op.next).zeroDict({// 根据父节点id显示下一级菜单.
								'dictid': op.showid,
								action : _CTX + '/plugins/dictListOption.do',
								style : 'option'
							});
						}
					}
				}else{
					// show the return value.
					$this.find('ul').html(data);
					if(op.showid){
						_this.setValByID(op.showid);
						if(op.next){
							$(op.next).zeroDict({'dictid': op.showid});// 根据父节点id显示下一级菜单.
//							$(op.next).find('button').html(op.defaultval + ' <span class="caret">');
//							$(op.next).find('input[type=hidden]').val('');
						}
					}
					// bind click event and set hidden input value.
					$('ul li a', $this).bind('click',function(){
						var dictID = $(this).data().dictid;
						$this.find('input[type=hidden]').val(dictID);
						$this.find('button').html($(this).text() + ' <span class="caret">');
						// next.
						if(op.next){
							$(op.next).zeroDict({'dictid': dictID});
							$(op.next).find('button').html(op.defaultval + ' <span class="caret">');
							$(op.next).find('input[type=hidden]').val('');
						}
					});
				}
				if(op.multiple){
					$this.multiSelect();
				}
				
				op.done && typeof(op.done) === 'function' && op.done();
				
				var nextEleID = $this.data().next;
				if(nextEleID){
					$this.bind('change',function(){
						var $this = $(this);
						$('option:selected', $this).each(function(){
							if($(this).val() != ''){
								$(nextEleID).zeroDict({
									'dictval': $(this).val(),
									action : _CTX + '/plugins/dictListOption.do',
									style : 'option'
								});
							}else{
								$(nextEleID).html("<option value=\"\" selected=\"selected\">请选择</option>");
							}
						});
					});
				}
			}, function() {
				op.fail && typeof(op.fail) === 'function' ? op.fail() : zeroAlert('get dict failed!');;
			});
		}
	};
	
	/* PLUGIN DEFINITION */
	var old = $.fn.zeroDict;
	
	$.fn.zeroDict = function(option){
		return this.each(function() {
			var $this = $(this), data = $this.data('zeroDict');
			var options = $.extend({}, $.fn.zeroDict.defaults, $this.data(), typeof option == 'object' && option);
			if(!data){
				$this.data('zeroDict', (data = new ZeroDict(this, options)));
			}
			options.dictid && data.setDictID(options.dictid);
			options.dictval && data.setDictVal(options.dictval);
			data.submit();
		});
	};
	
	$.fn.zeroDict.defaults = {
		method : 'post', //must
		action : _CTX + '/plugins/dictListLi.do', // _CTX + '/plugins/dictListOption.do',
		defaultval : '请选择',
		style : 'li' //option
	};
	
	$.fn.zeroDict.Constructor = ZeroDict;
	
	/* NO CONFLICT */
	$.fn.zeroDict.noConflict = function () {
		$.fn.zeroDict = old;
		return this;
	};
	
}(window.jQuery);


$(function(){
	$('div[data-dictonload=true]').each(function(){
		if($(this).data().dictall == true){
			$(this).zeroDict({
				action : _CTX + '/plugins/dictListLiAll.do'
			});
		}else{
			$(this).zeroDict();
		}
	});
	
	$('select[data-dictonload=true]').each(function(){
		if($(this).data().dictall == true){
			$(this).zeroDict({
				action : _CTX + '/plugins/dictListOptionAll.do',
				style : 'option'
			});
		}else{
			if($(this).attr('multiple') && $.fn.multiSelect){
				$(this).zeroDict({
					action : _CTX + '/plugins/dictListMultiOption.do',
					style : 'option',
					multiple: true,
				});
			}else{
				$(this).zeroDict({
					action : _CTX + '/plugins/dictListOption.do',
					style : 'option',
				});
			}
		}
	});
	// data-showid 是每一个使用了dict框架的select标签都有的.
//	$('select[data-showid]').change(function(){
//		var $this = $(this);
//		$('option:selected', $this).each(function(){
//			var nextEleID = $this.data().next;
//			if(nextEleID){
//				if($(this).val() != ''){
//					$(nextEleID).zeroDict({
//						'dictval': $(this).val(),
//						action : _CTX + '/plugins/dictListOption.do',
//						style : 'option'
//					});
//				}else{
//					$(nextEleID).html("<option value=\"\" selected=\"selected\">请选择</option>");
//				}
//				
//			}
//		});
//	});
	
	//radio框默认自动选择.
	$('.radio-list.zero-radio-onload').each(function(){
		var showval = $(this).data().showval;
		if(showval){
			$('input[type=radio]').each(function(){
				if(showval == $(this).val()){
					$(this).attr("checked",true);
				}
			});
		}
	});
});