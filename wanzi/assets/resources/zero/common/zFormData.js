var zFormData = function(formEle){
	if(formEle){
		var data = formEle ? $(formEle).serialize() : '';
		this.formData = data;
		return this.formData;
	}
	return '';
};

zFormData.prototype = {
	append : function(key, value){
		this.formData += '&' + key + '=' + value;
	},
	toString : function (){
		return this.formData;
	}
};
