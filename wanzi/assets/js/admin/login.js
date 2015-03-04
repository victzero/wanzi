var Login = function() {

	var handleLogin = function() {
		$('.login-form').validate({
			errorElement : 'span', // default input error message container
			errorClass : 'help-block', // default input error message class
			focusInvalid : false, // do not focus the last invalid input
			rules : {
				'user[name]' : {
					required : true
				},
				'user[password]' : {
					required : true
				},
			},

			messages : {
				username : {
					required : "请输入用户名."
				},
				password : {
					required : "请输入密码."
				}
			},

			invalidHandler : function(event, validator) {
				$('.alert-error', $('.login-form')).show();
			},

			highlight : function(element) { // hightlight error inputs
				$(element).closest('.form-group').addClass('has-error');
			},

			success : function(label) {
				label.closest('.form-group').removeClass('has-error');
				label.remove();
			},

			errorPlacement : function(error, element) {
				error.insertAfter(element.closest('.input-icon'));
			},

			submitHandler : function(form) {
				form.submit();
			}
		});

		$('.login-form input').keydown(function(e) {
			if (e.which == 13) {
				if ($('.login-form').validate().form()) {
					$('.login-form').submit();
				}
				return false;
			}
		});
	}

	return {
		// main function to initiate the module
		init : function() {

			handleLogin();

			$.backstretch([ "../assets/img/admin/bg/1.jpg",
					"../assets/img/admin/bg/2.jpg",
					"../assets/img/admin/bg/3.jpg",
					"../assets/img/admin/bg/4.jpg" ], {
				fade : 1000,
				duration : 8000
			});
		}

	};

}();