define("common",function(e){var o=e("jquery");o(function(){function e(e){e.preventDefault()}o(".common-header nav a").hover(function(){var e=o(this);e.hasClass("selected")||e.addClass("hover")},function(){o(this).removeClass("hover")}),o(".common-header nav").css("visibility","visible").addClass("animated fadeInDown"),o(".head-search,.head-member").css("visibility","visible").addClass("animated fadeInRightBig");var s=o("#backtotop");o(window).scroll(function(){o(window).scrollTop()>0?s.css("display","block"):s.css("display","none")});var n=o("body,html");s.click(function(){n.on("DOMMouseScroll mousewheel",e),n.animate({scrollTop:0},400,function(){n.off("DOMMouseScroll mousewheel",e)})})})});