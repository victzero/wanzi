/**
 * ZERO-CEDIT
 */
!function ($){
	
	/* CLASS DEFINITION */
	
	var ZeroEdit = function(element, options){
		this.$form = $(element); // form表单
		this.element = element;
		this.options = options;
		this.inited = false;
	};
	
	ZeroEdit.prototype = {
		init : function(){
			this.formData = new zFormData(this.element);
			var thisfd = this.formData;
			var op = this.options;
			if(op.asyncedit){
				if(op.type == 'MTO'){
					thisfd.append('cn',op.childclass);
					thisfd.append('pc',op.parentclass);
					thisfd.append('pid',op.parentid);
					op.pic && thisfd.append('pic',op.pic);
				}else if(op.type == 'MTM'){
					thisfd.append('cn',op.classname);
					thisfd.append('ric', op.inthis);
					thisfd.append('rc',op.relativeclass);
					thisfd.append('cir',op.inrelative);
					thisfd.append('rid',op.relativeid);
					op.isowner && thisfd.append('own', op.isowner);
				}else if(op.type == 'SELF'){
					op.classname ? thisfd.append('cn',op.classname) : false;
				}
			}else {
				if(op.type == 'SELF'){
					op.classname ? $('<input />').attr('type', 'hidden').attr('name', 'cn').attr('value', op.classname).appendTo(this.$form) : false;
				}
			}
			if(!this.inited){
				this.inited = true;
			}
			return this;
		},
		//提交
		submit : function(){
			this.init();
			var op = this.options;
			if(op.asyncedit){
				$.ajax({
					type : op.method,
					url : op.action,
					data : this.formData.toString(),
					dataType : 'json'
				}).then(function(data) {
					// doneCal
					//zeroAlert(data.message);
					op.done && typeof(op.done) === 'function' && op.done();
					if(op.asynclist){
						$(op.fliptarget).zeroFlip();
					}
					var back = op.callback && typeof(op.callback) === 'function' ? true : false;
					if(back){
						op.callback();
					}
				}, function() {
					// failCal
					op.fail && typeof(op.fail) === 'function' ? op.fail() : zeroAlert('save failed!');;
					var back = op.callback && typeof(op.callback) === 'function' ? true : false;
					if(back){
						op.callback();
					}
				});
			}else{
				$('[disabled][data-subany=true]', this.element).each( function() {
					$(this).removeAttr('disabled');
			    });
				this.$form.attr("method", op.method);
				this.$form.attr("action", op.action);
				this.$form.submit();
			}
		}
	};
	
	/* PLUGIN DEFINITION */
	var old = $.fn.zeroEdit;
	
	/**
	 * 参数说明:()为默认值,{}为参数说明.
	 * must:
	 * 		classname	: {类名}.
	 * 		action		: {请求地址}.
	 * optional:
	 * 			: [(false) | true] 是否异步.
	 * 		sort	: {排序列}.
	 * 		flipto	: {int 跳转页}.
	 * 		method	: ['post' | 'get'].
	 * 		totalcount	: [{int}].
	 * notSupport:
	 * 		redirectURL : 写在form表单中,不支持传参.
	 */
	$.fn.zeroEdit = function(option){
		return this.each(function() {
			var $this = $(this), data = $this.data('zeroEdit');
			var options = $.extend({}, $.fn.zeroEdit.defaults, $this.data(), typeof option == 'object' && option);
			if(!data){
				$this.data('zeroEdit', (data = new ZeroEdit(this, options)));
			}
			
			if(typeof(CKEDITOR) != 'undefined'){
				if(CKEDITOR && CKEDITOR.instances){
					for(var instanceName in CKEDITOR.instances) {
		                CKEDITOR.instances[instanceName].updateElement();
		            }
				}
			}
			
			if($.validator && !$this.valid()){
				return;
			}
			
			data.submit();
		});
	};
	
	$.fn.zeroEdit.defaults = { // 不支持大小写
		method : 'post', //must
		asynclist : false,
		asyncedit : true, //默认同步保存,只有无关联保存时需要手动设为false.
		type: 'SELF' //默认无关联保存
	};
	
	$.fn.zeroEdit.Constructor = ZeroEdit;
	
	/* NO CONFLICT */
	$.fn.zeroEdit.noConflict = function () {
		$.fn.zeroEdit = old;
		return this;
	};
	
	/* DATA-API */
	$(document).on(
			'click',
			'[data-coedit],[data-credit],[data-cedit]',
			function(e){
				var $this = $(this), $target = null, options = null;
				if($this.attr('data-coedit')){
					$target = $($this.attr('data-coedit'));
					options = $.extend({}, $this.data(), {type : 'MTO'});
				}else if($this.attr('data-credit')){
					$target = $($this.attr('data-credit'));
					options = $.extend({}, $this.data(), {type : 'MTM'});
				}else if($this.attr('data-cedit')){
					$target = $($this.attr('data-cedit'));
					options = $.extend({}, $this.data(), {type : 'SELF'});
				}
				
				$target.zeroEdit(options);
				
				e.preventDefault();
			});
	
}(window.jQuery);
