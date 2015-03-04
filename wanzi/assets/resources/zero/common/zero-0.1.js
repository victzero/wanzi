/**
 * 排序,不支持在查询的同时添加排序,只支持对查询的结果进行排序操作.
 * 
 * @param fieldName
 * @param formID
 */
function sortByPost(fieldName, formID, totalCount) {
	var form = document.getElementById(formID);
	var $sortInput = $("#" + formID + " #sort");
	var lastSort = $sortInput.attr("name");
	if (lastSort == fieldName) {
		$('<input />').attr('type', 'hidden').attr('name', 'sortField').attr('value', fieldName).appendTo("#" + formID);
		var desc = $sortInput.val();
		desc = (desc == 'false' ? true : false);
		$('<input />').attr('type', 'hidden').attr('name', 'sortDesc').attr('value', desc).appendTo("#" + formID);
	} else {
		$('<input />').attr('type', 'hidden').attr('name', 'sortField').attr('value', fieldName).appendTo("#" + formID);
		$('<input />').attr('type', 'hidden').attr('name', 'sortDesc').attr('value', true).appendTo("#" + formID);
	}
	if(totalCount == ''){
		totalCount = 0;
	}
	$('<input />').attr('type', 'hidden').attr('name', 'totalCount').attr('value', totalCount).appendTo("#" + formID);
	form.submit();
}

function flipByPost(page, formID, totalCount) {
	var form = document.getElementById(formID);
	var $sortInput = $("#" + formID + " #sort");
	var lastSort = $sortInput.attr("name");
	$('<input />').attr('type', 'hidden').attr('name', 'sortField').attr('value', lastSort).appendTo("#" + formID);
	var desc = $sortInput.val();
	$('<input />').attr('type', 'hidden').attr('name', 'sortDesc').attr('value', desc).appendTo("#" + formID);
	if(totalCount == ''){
		totalCount = 0;
	}
	$('<input />').attr('type', 'hidden').attr('name', 'totalCount').attr('value', totalCount).appendTo("#" + formID);
	$('<input />').attr('type', 'hidden').attr('name', 'pageNo').attr('value', page).appendTo("#" + formID);
	form.submit();
}
