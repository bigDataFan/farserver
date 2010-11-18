<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
  
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="org.springframework.web.context.WebApplicationContext"%>
<%@page import="net.gqu.security.BasicUserService"%>
<%@page import="java.util.List"%>
<%@page import="net.gqu.security.Role"%><html>
<head>
<title></title>
<link rel="stylesheet" type="text/css" href="/css/simple.css">


<%

WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
BasicUserService userService = (BasicUserService) ctx.getBean("userService");

List<Role> openRoles = userService.getOpenRoles();

%>
</head>
<body>
<div id="main">
	
		<div class="site">
		<div class="pagehead">
			<h2>用户注册</h2>   
		</div>
		
		<%if (openRoles.size()==0) { %>
			抱歉，当前服务器不允许匿名注册，请联系服务器管理员
		<%} else { %>
			<form action="register" method="POST">
				<%=(String)session.getAttribute("error") %>
		    	<label for="username">
   						用户名<br />
 					    <input class="text" type="text" name="username"  value="" /> <font color="red"><%=session.getAttribute("username")==null?"":session.getAttribute("username")%></font>
 					</label>
 				
 				<label for="role">
   					 用户祖<br />
 					    <select name="role">
 					    	<%for(Role role: openRoles) { %>
 					    		<option value="<%=role.getId() %>"> <%=role.getName() %></option>
 					    	<%} %> 
 					    </select>
 					</label>	
 					
 					<label for="pwd">
   						密码<br />
 					    <input class="text" type="password" name="pwd"  value="" /><font color="red"><%=session.getAttribute("pwd")==null?"":session.getAttribute("pwd")%></font>
 					</label>
 					<label for="pwdcfm">
   						再输入一次密码<br />
 					    <input class="text" type="password" name="pwdcfm"  value="" /><font color="red"><%=session.getAttribute("pwdcfm")==null?"":session.getAttribute("pwdcfm")%></font>
 					</label>
 					<label for="email">
   						电子邮件<br />
 					    <input class="text" type="text"  name="email"  value="" /><font color="red"><%=session.getAttribute("email")==null?"":session.getAttribute("email")%></font>
 					</label>
 					<label for="randomimg">
   						请输入这个图片的内容  <img src="rndimg" id="imgg"><br />
 					    <input class="text" type="text"  name="randomimg"  value="" /><font color="red"><%=session.getAttribute("randomimg")==null?"":session.getAttribute("randomimg")%></font>
 					</label>
 					
    				<input type="submit" value="注册"/>
			</form>	
			<%} %>
	      		</div>
</div>

</body>
</html>