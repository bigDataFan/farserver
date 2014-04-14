$(document).ready(function() {
	$(".login-wrapper").hover(function() {
		$(".nav-dropdown").slideDown('fast');
	}, function() {
		$(".nav-dropdown").slideUp('fast');
	});
	
	if (person) {
		userLogon(person);
	}
	$(".recommend .view .article-title").hide();
	
	$(".recommend .view").hover(function() {
		$(this).find(".article-title").fadeIn("fast");
	}, function() {
		$(this).find(".article-title").fadeOut("fast");
	});

	$(".time-formated").each(function() {
		$(this).html(Utils.formatTime(parseInt($(this).html())));
	});
	
	$(".pager div.article").hover(function() {
		$(this).find("img").css("margin-top", "-40px");
	}, function() {
		$(this).find("img").css("margin-top", "0px");
	});
	
	viewPageInit();
});

function viewPageInit() {
	
}


function myHome() {
	if (person) {
		location.href = "/web/home.html";
	} else {
		loginDialog();
	}
}

function closeDialog() {
	$("#modal").hide();
}

function loginDialog() {
	$("#modal").show();
	$("#login").show();
	$("#register").hide();
}

function registerDialog() {
	$("#modal").show();
	$("#login").hide();
	$("#register").show();
}

function login() {
	if ($("#user_login").val()=="") {
		$("#logon-result").html("用户名不能为空"); return;
	}
	if ($("#user_pass").val()=="") {
		$("#logon-result").html("密码不能为空"); return;
	}
	
	$.post("/login", {
		'name': $("#user_login").val(),
		'password': $("#user_pass").val()
	},  function() {
		person = $("#user_login").val();
		userLogon(person);
		closeDialog();
	}).fail( function() {
		$("#logon-result").html("用户名或密码错误");
	});
}


function register() {
	var user = $("#reg_user").val();
	var password = $("#reg_user_pass").val();
	var cfm = $("#reg_user_pass_cfm").val();
	var email = $("#reg_email").val();
	
	if (user.length<6) {
		
	}
}

function logout() {
	location.href = "/logout";
}


function userLogon(name) {
	$(".nav-dropdown .guest").hide();
	$(".nav-dropdown .logon").show();
	$(".login-wrapper .status span").html(name);
}

function isEmail(str){
	var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
	return reg.test(str);
}


function onUpper() {
	var o = $(".slideview").data("opened");
	if (o==null) {
		closeCover();
	} else {
		if (o==0) return;
		o --;
		$(".slideview").data("opened", o);
		$(".slideview .img").css("background-position-y" , -602 * o);
	}
}

function onDowner() {
	var o = $(".slideview").data("opened");
	if (o==null) {
		closeCover();
	} else {
		o ++;
		$(".slideview").data("opened", o);
		$(".slideview .img").css("background-position-y" , -602 * o);
	}
}

function closeCover() {
	var img = new Image;
	img.src = $(".slideview .img").css('background-image').replace(/url\(|\)$|"/ig, '');
	
	alert($(".slideview .img").css("background-size"));
	$(".slideview").data("opened", 0);
	
	$(".slideview .upper,.slideview .downer").css("background", "transparent");
	$(".slideview .upper,.slideview .downer").html("");
	$(".slideview .upper,.slideview .downer").css("border-bottom", "none");
	$(".slideview .upper,.slideview .downer").css("border-top", "none");
}