<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="com.ever365.oauth.sina.SinaAuthUrlServlet"%>
<%@page import="com.ever365.oauth.OAuthUtils"%>
<%@page import="org.scribe.model.Token"%><html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%
	Token requesToken = null;
	requesToken = OAuthUtils.getSinaOAuthService().getRequestToken();
	request.getSession().setAttribute("_sina_req_token", requesToken);

String requestUrl = OAuthUtils.getSinaOAuthervice().getAuthorizationUrl(requesToken);
%>
<link rel="stylesheet" type="text/css" href="/main.css"/>
<title>使用微博账号登陆</title>
</head>
<body>
	<div id="terminal">
		<p>请访问以下地址用新浪微博账号登陆</p>
		<p><a href="<%=requestUrl%>" target="_blank"><%=requestUrl%></a></p>
		<p>允许通过后，请将新浪微博的授权码输入</p>
		<form method="GET" action="/oauth/sina">
			<input  type="text" name="code">
			<span id="custom_join_button" class="awesome blue medium register_button link" style="margin-left: 12px;"> <a href="javascript:document.forms[0].submit()">登入</a></span>
			
		</form>
	</div>

</body>
</html>