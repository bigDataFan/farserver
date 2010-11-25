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


<link rel="stylesheet"  href="../js/jquery.mobile-1.0a1/jquery.mobile-1.0a1.min.css" />
<script src="../js/jquery-1.4.2.min.js"></script>
<script src="../js/jquery.mobile-1.0a1/jquery.mobile-1.0a1.min.js"></script>


<%

WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
ApplicationService applicationService = (ApplicationService)ctx.getBean("applicationService");
Map<String, InstalledApplication> installed = applicationService.getUserInstalledApplications(AuthenticationUtil.getCurrentUser());
%>

</head>
<body>

<div data-role="page">

	<div data-role="header" data-theme="c">
		<a href="../logout" exteral="true" data-icon="star">退出</a>
		<h1>我的首页</h1>
	</div><!-- /header -->
	<div data-role="content">
		<ul data-role="listview" data-inset="true" data-theme="c" data-dividertheme="b">
			<li data-role="list-divider">查找应用</li>
			<li data-role="list-divider"><a href="installForm.jsp">安装应用</a></li>
			<%for (InstalledApplication ia: installed.values()) { %>
				<li><a href="../user/<%=ia.getUser() %>/<%=ia.getMapping() %>/"><%=ia.getMapping() %></a></li>
			<%} %>
		</ul>
	</div>
		
	<div data-role="footer" data-theme="c">
		<h4>&copy; 2010  G-QU.NET</h4>
	</div><!-- /header -->
</div>


	

</body>
</html>