<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="net.gqu.security.AuthenticationUtil"%>
<%@page import="org.springframework.web.context.WebApplicationContext"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="java.util.Map"%>
<%@page import="net.gqu.application.InstalledApplication"%>
<%@page import="net.gqu.application.ApplicationService"%>
<%@page import="net.gqu.security.BasicUserService"%>
<%@page import="net.gqu.security.User"%>
<%@page import="net.gqu.security.Role"%>
<%@page import="net.gqu.application.RegisteredApplication"%><html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>我的首页</title>


<link rel="stylesheet" type="text/css" href="../main.css"/>

<%

WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
ApplicationService applicationService = (ApplicationService)ctx.getBean("applicationService");
BasicUserService userService = (BasicUserService)ctx.getBean("userService");
Map<String, InstalledApplication> installed = null;//applicationService.getUserInstalledApplications(AuthenticationUtil.getCurrentUser());

User user = userService.getUser(AuthenticationUtil.getCurrentUserName());
Role role = userService.getRole(user.getRole());


%>



</head>
<body>


<div class="top">
<ul id="nav">
	<li><a href="/index.html">挑选应用</a></li>
	<li><a href="/logout">退出</a></li>
</ul>
</div>

<div class="container">

<div class="left box" style="min-height: 400px">
	<h3>我安装的应用</h3>
	<ul class="iconlist">
		<%
			for (InstalledApplication ia: installed.values()) {
				RegisteredApplication registered = applicationService.getApplication(ia.getApp());
		%>
					
					<li>
					<a target="_blank" href="../user/<%=ia.getUser() %>/<%=ia.getMapping() %>/">
					<img border="0" src="<%=registered.getIcon() %>" style="float: left;"/><h3><%=registered.getAlias() %></h3></a></li>
		<%} %>
	</ul>
</div>




		
	<div class="box right">
	<h3>基本信息</h3>
	<ul id="userAttrs">
		<li>帐号： <%=AuthenticationUtil.getCurrentUserName() %>  </li>
		<li>电子邮件： <%=user.getEmail() %>  </li>
		<li>文件已使用： <%=(new Double(user.getContentUsed()/(1024*1024))).intValue() %>M   </li>
		<%if (role !=null && role.isEnabled() && !user.isDisabled()) { %>
		<li>群组： <%=role.getName() %>  </li>
		<li>单个文件大小限制   <%=role.getContentSize()/(1024*1024) %>M</li>
		<li>文件 总限制 <%=role.getTotalSize()/(1024*1024)  %>M</li>
		<%} else { %>
			<li>您所在的群组已经被限制使用 </li>
		<%} %>
	</ul>
	</div>
	
	<div class="box right">
	
		<form action="/service/user/googlepwd" method="POST">
		<h3>Google服务状态</h3>
		<ul id="googleServices">
		
		<li>google用户名： <input type="text" value="<%=user.getAttr(user.ATTR_GOOGLE_USER) %>" name="googleuser"></li>
		<li>google密码： <input type="text" value="<%=user.getAttr(user.ATTR_GOOGLE_PWD) %>" name="googlepwd"> <input type="submit" value="保存"></input></li>
		<li>设置用户名密码到服务器可以完整使用google服务。<font color="red">注：使用此项服务需要对当前网站的信任，因为需要保存密码到网站中 </font></li>
		</ul>
		</form>
	
	</div>
	
	<div class="box right">
	<h3>安装应用</h3>
	
		<form method="POST" action="../service/application/install">
		<ul>
			<li>输入应用的ID <input name="application">  <input type="submit" value="安装"></li>
		</ul>
		</form>
	</div>
		





</div>
</body>
</html>