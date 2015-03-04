var zeroApp = function() {

	var handleSideInit = function() {
		$('#sidebar-menu>li').each(function(){
			var clazz = $(this).attr('class');
			if(clazz && typeof(_NAVID) != 'undefined'){
					if(clazz.indexOf('nav_' + _NAVID.substring(0, 1)) != -1){
						$(this).addClass('active');
						_deepSideBar($(this), 1);
					}
			}
		});
	};
	
	function _deepSideBar(ul, index){
		ul.children('ul').children('li').each(function(){
			var clazz = $(this).attr('class');
			if(clazz.indexOf('nav_' + _NAVID.substring(0, index+1)) != -1){
				$(this).addClass('active');
				_deepSideBar($(this));
			}
		});
	}

	return {

		init : function() {
			handleSideInit(); // 初始化导航栏高亮.
		},

	};

}();

var historyGoBack = function(index){
	history.go(index);
};

var zeroValidation = function(data) {
	var form1 = $('#' + data.form);
	var error1 = $('.alert-danger', form1);
	var success1 = $('.alert-success', form1);
	
	if(data.onsubmit){
	}else{
		data.onsubmit = false;
	}
	
	form1.validate({
	    errorElement: 'span', //default input error message container
	    errorClass: 'help-block', // default input error message class
	    focusInvalid: false, // do not focus the last invalid input
	    ignore: "",
	    rules: data.rules,
        messages: data.messages,
        
        onsubmit: data.onsubmit,
	
        errorPlacement: function (error, element) { // render error placement for each input type
            if (element.parent(".input-group").size() > 0) {
                error.insertAfter(element.parent(".input-group"));
            } else if (element.attr("data-error-container")) { 
                error.appendTo(element.attr("data-error-container"));
            } else if (element.parents('.radio-list').size() > 0) { 
                error.appendTo(element.parents('.radio-list').attr("data-error-container"));
            } else if (element.parents('.radio-inline').size() > 0) { 
                error.appendTo(element.parents('.radio-inline').attr("data-error-container"));
            } else if (element.parents('.checkbox-list').size() > 0) {
                error.appendTo(element.parents('.checkbox-list').attr("data-error-container"));
            } else if (element.parents('.checkbox-inline').size() > 0) { 
                error.appendTo(element.parents('.checkbox-inline').attr("data-error-container"));
            } else {
                error.insertAfter(element); // for other inputs, just perform default behavior
            }
        },
        
	    invalidHandler: function (event, validator) { //display error alert on form submit              
	        success1.hide();
	        error1.show();
	        App.scrollTo(error1, -200);
	    },
	
	    highlight: function (element) { // hightlight error inputs
	        $(element)
	            .closest('.form-group').addClass('has-error'); // set error class to the control group
	    },
	
	    unhighlight: function (element) { // revert the change done by hightlight
	        $(element)
	            .closest('.form-group').removeClass('has-error'); // set error class to the control group
	    },
	
	    success: function (label) {
	        label
	            .closest('.form-group').removeClass('has-error'); // set success class to the control group
	    },
	
	    submitHandler: function (form) {
	        success1.show();
	        error1.hide();
	        form.submit();
	    }
	});
};