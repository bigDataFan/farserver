<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="net.gqu.security.AuthenticationUtil"%>
<%@page import="org.springframework.web.context.WebApplicationContext"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="java.util.Map"%>
<%@page import="net.gqu.application.InstalledApplication"%>
<%@page import="net.gqu.application.ApplicationService"%><html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>我的首页</title>


<link rel="stylesheet" type="text/css" href="../css/main.css"/>

<%

WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
ApplicationService applicationService = (ApplicationService)ctx.getBean("applicationService");
Map<String, InstalledApplication> installed = applicationService.getUserInstalledApplications(AuthenticationUtil.getCurrentUser());
%>

</head>
<body>


<div class="top">
<ul id="nav">
	<li><a href="installForm.jsp">应用安装</a></li>
</ul>
</div>


<div id="sidebar">
	<div class="box">
	<h3>应用安装</h3>
	<form method="POST" action="../service/application/install">
		   应用名称  <input name="application"  value="<%=request.getParameter("app")%>"> <br>
				<input type="submit" value="安装">
		</form>
	</div>
</div>

</body>
</html>