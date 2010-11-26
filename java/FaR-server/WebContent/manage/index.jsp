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
	<h3>我安装的应用</h3>
	<ul>
		<%for (InstalledApplication ia: installed.values()) { %>
					<li><a href="../user/<%=ia.getUser() %>/<%=ia.getMapping() %>/"><%=ia.getMapping() %></a></li>
		<%} %>
	</ul>
	</div>
</div>

	

</body>
</html>