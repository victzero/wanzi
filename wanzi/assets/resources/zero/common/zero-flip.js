/**
 * ZERO-FLIP
 */
!function ($){
	
	/* CLASS DEFINITION */
	
	var ZeroFlip = function(element, options){
		this.$form = $(element); // form表单
		this.element = element;
		this.options = options;
		this.inited = false;
	};
	
	ZeroFlip.prototype = {
		init : function(){
			if(!this.inited){
				if(this.options.async){
					this.formData = new zFormData(this.element);
					this.options.classname ? this.formData.append('cn',this.options.classname) : false;
					this.options.jspsuffix ? this.formData.append('jspSuffix',this.options.jspsuffix) : false;
				}
				if(!this.options.async){
					this.$form.attr('method', this.options.method);
					this.options.classname ? this.$form.attr('action', this.options.action + "?cn=" + this.options.classname) : this.$form.attr('action', this.options.action);
					this.options.jspsuffix ? $('<input />').attr('type', 'hidden').attr('name', 'jspSuffix').attr('value', this.options.jspsuffix).appendTo(this.$form) : false;
				}
				this.inited = true;
			}
			
			return this;
		},
		setTotalCount : function(){ // 只有分页 和 排序 时才使用.
			if(this.options.async){
				var lastCount = this.options.totalcount;
				if(lastCount != 0 && lastCount != '' ){
					this.formData.append('filter[totalCount]',lastCount);
				}
			}else{
				var totalCount = this.options.totalcount;
				if(totalCount == ''){
					totalCount = 0;
				}
				$('<input />').attr('type', 'hidden').attr('name', 'filter[totalCount]').attr('value', totalCount).appendTo(this.$form);
			}
			return this;
		},
		//排序
		sort : function(column){
			this.init().setTotalCount();
			if(column){
				if(this.options.async){
					if(!this.options.sort){
						this.options.sort = column;
						this.options.sortdesc = true;
					}else{
						if(this.options.sort == column){
							var desc = this.options.sortdesc;
							desc = (desc == false ? true : false);
							this.options.sortdesc = desc;
						}else{
							this.options.sort = column;
							this.options.sortdesc = true;
						}
					}
					this.formData.append('sortField',this.options.sort);
					this.formData.append('sortDesc',this.options.sortdesc);
				}else{
					var $sortInput = this.$form.find('#sort');
					if($sortInput.length != 0){
						var lastSort = $sortInput.attr("name");
						lastSort = lastSort.substring(lastSort.indexOf('.') + 1);
						var desc = true;
						if(!column){
							column = lastSort;
							desc = $sortInput.val();
						}else if (lastSort == column) {
							desc = $sortInput.val();
							desc = (desc == 'false' ? true : false);
						}
						$('<input />').attr('type', 'hidden').attr('name', 'sortField').attr('value', column).appendTo(this.$form);
						$('<input />').attr('type', 'hidden').attr('name', 'sortDesc').attr('value', desc).appendTo(this.$form);
					}
				}
			}
			return this;
		},
		//查询
		search : function(){
			this.init();
		},
		//分页
		flip : function(no){
			this.init().sort();
			if(this.options.async){
				this.formData.append('filter[pageNo]',no);
			}else{
				$('<input />').attr('type', 'hidden').attr('name', 'filter[pageNo]').attr('value', no).appendTo(this.$form);
			}
			return this;
		},
		//提交
		submit : function(){
			this.init();
			var op = this.options;
			if(op.async){
				var op = this.options;
				$.ajax({
					type : op.method,
					url : op.action,
					data : this.formData.toString(),
					dataType : 'xml'
				}).then(function(data) {
					// doneCal
					op.tbody && $(op.tbody).html($(data).find('trs').text());
					op.pagination && $(op.pagination).html($(data).find('pagination').text());
					op.totalcount = $(data).find('totalcount').text();
				}, function() {
					// failCal
					alert('failed!');
				});
				this.inited = false;
			}else{
				//$('<input />').attr('type', 'hidden').attr('name', 'pageSize').attr('value', 3).appendTo(this.$form);
				this.$form.submit();
			}
			
		}
	};
	
	/* PLUGIN DEFINITION */
	var old = $.fn.zeroFlip;
	
	/**
	 * 参数说明:()为默认值,{}为参数说明.
	 * must:
	 * 		classname	: {类名}.
	 * 		action		: {请求地址}.
	 * optional:
	 * 		async	: [(false) | true] 是否异步.
	 * 		sort	: {排序列}.
	 * 		sortdesc: {}
	 * 		flipto	: {int 跳转页}.
	 * 		method	: ['post' | 'get'].
	 * 		totalcount	: [{int}].
	 */
	$.fn.zeroFlip = function(option){
		return this.each(function() {
			var $this = $(this), data = $this.data('zeroFlip');
			var options = $.extend({}, $.fn.zeroFlip.defaults, $this.data(), typeof option == 'object' && option);
			if(!data){
				$this.data('zeroFlip', (data = new ZeroFlip(this, options)));
			}
			var sortColumn, flipNo;
			if(sortColumn = options.sort){
				data.sort(sortColumn).submit();
			}else if(flipNo = options.flipto){
				data.flip(flipNo).submit();
			}else if(options.submit){
				data.submit();
			}else{
				data.submit();
			}
		});
	};
	
	$.fn.zeroFlip.defaults = { // 不支持大小写
		async : false,
		method : 'post', //must
		totalcount : 0
	};
	
	$.fn.zeroFlip.Constructor = ZeroFlip;
	
	/* NO CONFLICT */
	$.fn.zeroFlip.noConflict = function () {
		$.fn.zeroFlip = old;
		return this;
	};
	
	/* DATA-API */
	$(document).on(
			'click',
			'[data-sort],[data-flipto],[data-search]',
			function(e){
				var $this = $(this), href, $target;
				if($this.attr('data-search')){
					$target = $($this.attr('data-search'));
				}else if($this.attr('data-flipto')){
					$target = $($this.closest('[data-target]').attr('data-target'));
				}else{
					$target = $($this.attr('data-target') || (href = $this.attr('href'))
							&& href.replace(/.*(?=#[^\s]+$)/, ''));
				}
				var options = $.extend({}, $this.data());
				
				$target.zeroFlip(options);
				
				e.preventDefault();
			});
	
}(window.jQuery);

$(function($){
	$('[data-listonload=true]').each(function(){
		$('#' + $(this).attr('id')).zeroFlip();
	});
});

function gotoPage(btn){
	var page = $(btn).parent().find('.pageNumber').val();
	$($(btn).closest('[data-target]').attr('data-target')).zeroFlip({
		flipto : page
	});
}