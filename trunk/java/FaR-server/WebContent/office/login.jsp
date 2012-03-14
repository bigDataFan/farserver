<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="common.css"/>

<script type="text/javascript" src="http://openapi.360.cn/js/o360_connect.js"></script>
<script type="text/javascript" src="/js/json2.js"></script>

<%
	if (request.getParameter("redirectTo")!=null) {
	session.setAttribute("redirectTo", request.getParameter("redirectTo"));
	}
	
	if (request.getParameter("oauth")!=null) {
		if ("baidu".equals(request.getParameter("oauth"))) {
			response.sendRedirect("http://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=waxDdavqGbR1K3qx19pyorqg&redirect_uri=http%3A%2F%2Fwww.ever365.com%2Foauth%2Fbaidu");
			return;
		}
	}

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
</script>
<title>请登陆以进一步使用</title>

</head>
<body>
	
	<div id="times" class="pages">
		<div class="pagebar">
		请登陆以进一步使用
             </div>
             
			<div class="details views" >
				<form action="/login" method="POST">
				<div class="label">
					账号：  <input type="text" name="username" size="16" width="200"> 
				</div>
				<div class="label">
					密码：  <input type="password"" name="password" size="16" width="200">
				</div>
				<input type="hidden"  name="from" value="/office/login.jsp">
				
				<div class="label">
					<a class="operations" href="javascript:document.forms[0].submit()">登陆</a> 
					<%
						if (session.getAttribute("loginError")!=null) {
							out.print("<font color='red'>" + session.getAttribute("loginError") + "</font>");
						}	
				    %>    
				</div>
				
				<div class="label">
					  没有账号？请 <a href="/office/register.jsp">注册</a>
				</div>
				
				
				<div class="label other">
					 &nbsp;<a href="javascript:go360()"> <img src="image/login360.png" alt="360账号登录" border="0"> </a>
				</div>
				
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