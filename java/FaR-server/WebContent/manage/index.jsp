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
<%@page import="net.gqu.security.Role"%><html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>我的首页</title>


<link rel="stylesheet" type="text/css" href="../main.css"/>

<%

WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
ApplicationService applicationService = (ApplicationService)ctx.getBean("applicationService");
BasicUserService userService = (BasicUserService)ctx.getBean("userService");
Map<String, InstalledApplication> installed = applicationService.getUserInstalledApplications(AuthenticationUtil.getCurrentUser());

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

<div class="box left">
<h3>基本信息</h3>
<ul id="userAttrs">
	<li>帐号： <%=AuthenticationUtil.getCurrentUserName() %>  </li>
	<li>电子邮件： <%=user.getEmail() %>  </li>
	<li>文件已使用： <%=user.getContentUsed() %>   </li>
	<%if (role !=null && role.isEnabled() && !user.isDisabled()) { %>
	<li>群组： <%=role.getName() %>  </li>
	<li>单个文件大小限制   <%=role.getContentSize() %></li>
	<li>文件 总限制 <%=role.getTotalSize() %></li>
	<%} else { %>
		<li>您所在的群组已经被限制使用 </li>
	<%} %>
</ul>
</div>

<div class="box left">

	<form action="/service/user/googlepwd" method="POST">
	<h3>Google服务状态</h3>
	<ul id="googleServices">
	
	<li>google用户名： <input type="text" value="<%=user.getAttr(user.ATTR_GOOGLE_USER) %>" name="googleuser"></li>
	<li>google密码： <input type="text" value="<%=user.getAttr(user.ATTR_GOOGLE_PWD) %>" name="googlepwd"> <input type="submit" value="保存"></input></li>
	<li>注：设置用户名密码到服务器可以完整使用google服务。否则只能通过google的标识认证流程来使用google服务</li>
	<li>
	google日历状态：   
	已获取[ <%=user.getAttr(user.ATTR_GOOGLE_CAL_TOKEN) %>] 您可以<a href="<%=userService.getUserCalToken("http:" + request.getServerName()+ ":" +request.getServerPort()) %>">向google申请标识</a>
	</li>
	</ul>
	</form>

</div>

<div class="box left">
<h3>安装应用</h3>
	<form method="POST" action="../service/application/install">
	输入应用的ID <input name="application"> <br>
				<input type="submit" value="安装">
	</form>
</div>


<div class="box left">
	<h3>我安装的应用</h3>
	<ul>
		<%for (InstalledApplication ia: installed.values()) { %>
					<li><a target="_blank" href="../user/<%=ia.getUser() %>/<%=ia.getMapping() %>/"><%=ia.getMapping() %></a></li>
		<%} %>
	</ul>
</div>

	

</body>
</html>