<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="/css/common.css"/>
<script type="text/javascript" src="http://openapi.360.cn/js/o360_connect.js"></script>

<%
	if (request.getParameter("redirectTo")!=null) {
	session.setAttribute("redirectTo", request.getParameter("redirectTo"));
	}


	String appkey360 = "34cb3c964f6be83d7bf1867f15512b93";
	String oauth360 = 
			"https://openapi.360.cn/oauth2/authorize?client_id=" + appkey360 + "&response_type=code&scope=basic&display=default";

%>

<script type="text/javascript">

//O360.Connect.init();

function go360() {
	
	   //初始化O360.Connect
    if (O360.Connect.init("34cb3c964f6be83d7bf1867f15512b93", '0.5')) {
        O360.Connect.getUser('dealWithUser');
    } else {
		alert("请在360桌面上进行登录");
    	//由于桌面的版本问题，老版本的桌面不支持用户使用应用时登陆（当需要从浏览器登录的时候，请走这一步）
    }
	   
}

function dealWithUser(info) {
	if (info=="") {
		O360.Connect.login(loginedby360);
	} else {
		doCheck(info);
	}
}

function doCheck(info) {
	var userInfo = info; //JSON.parse(info);
	if (userInfo.name=="") {
		alert("360用户为自动生成，无法登录");
		return;
	}
	location.href = "/oauth/dt360?name=" + userInfo.name + "&id=" + userInfo.id + "&signature=" + userInfo.signature + "&avatar=" + userInfo.avatar;
}

function loginedby360(info) {
	if (info==null || info=="") {
		return;
	}
	
	doCheck(info);
	
}

function login() {
	location.href = "/weblogin?username=" + document.getElementById("userName").value + "&password=" + document.getElementById("password").value + "&from=/login/login.jsp";
}
</script>
<title>请登陆以进一步使用</title>

</head>
<body>
	
	<div id="times" class="pages">
		<div class="pagebar">
		请登陆以进一步使用
             </div>
             
			<div class="details views" >
				<form action="/weblogin" method="POST">
				<div class="label">
					账号：  <input type="text" name="username" id="userName" size="16" width="200"> 
				</div>
				<div class="label">
					密码：  <input type="password" name="password" size="16" id="password" width="200">
				</div>
				<input type="hidden"  name="from" value="login/login.jsp">
				
				<div class="label">
					<a class="operations" href="javascript:login()">登陆</a> 
					<%
						if (session.getAttribute("loginError")!=null) {
							out.print("<font color='red'>" + session.getAttribute("loginError") + "</font>");
						}	
				    %>    
				</div>
				
				<div class="label">
					  没有账号？请 <a href="/register.jsp">注册</a>
				</div>
				<!-- 
				<div class="label other">
					 &nbsp;<a href="<%=oauth360%>"> <img src="image/360login.png" alt="360账号登录" border="0"> </a>
				</div>
				  -->
				 
				<!-- 
				<div class="label other">
					 &nbsp;<img src="http://static.youku.com/v1.0.0687/partner/img/ico_sina_16x16.png" alt="新浪微博"> <a href="/login/sina.jsp">用新浪微博账号登陆</a>
				</div>
				 -->	  
				</form>
			</div>
			
			<div class="pageFootbar">
				
			</div>
	</div>
</body>
</html>