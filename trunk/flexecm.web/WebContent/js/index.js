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
	/*
	$(".pager div.article .article-title").css("bottom", "260");
	
	$(".pager div.article").hover(function() {
		$(this).find(".article-title").css("bottom",250-parseInt($(this).find(".article-title").css("height")));
	}, function() {
		$(this).find(".article-title").css("bottom", "260px");
	});
	*/
	
	$(".pager div.article").hover(function() {
		$(this).find("img").css("margin-top", "-40px");
	}, function() {
		$(this).find("img").css("margin-top", "0px");
	});
});

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
		userLogon($("#user_login").val());
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
