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
<div class="top">
<ul id="nav">
	<li><a href="/hom/">首页</a></li>
	<li><a href="/rec/">最新推荐</a></li>
	<li><a href="/app/">榜首应用</a></li>
	<li><a href="/for/">论坛</a></li>
	<li><a href="/com/">社区</a></li>
</ul>
</div>
<div id="content">
<div class="gutter" id="slider">
<form action="/a/b/c" id="thisform" method="post">
<p class="tout">请在此注册</p>
<p><label for="name" accesskey="9">用户名：</label></p>
</br>
<input type="text" id="name" name="name" />
</p>
<p><label for="email">Email ：</label></p>
<input type="email" id="email" name="email" tabindex="2" />
</p>
<p><label for="password">密&nbsp;&nbsp;&nbsp;码：</label></br>
</p>
<input type="password" id="email" name="password" tabindex="3" />
</p>
<p><label for="password">请再输一次密码：</label></br>
</p>
<input type="password" id="email" name="password" tabindex="4" />
</p>
<p><labelfor"remember">输入验证码：</label></br></p>
<input type=text " id=text " name"text" tabindex="3" />
<p><input id="submit" type="submit" value="立即注册" tabindex="5" /></p>

</form>
</div>


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

</div>
<div id="sidebar">
<div class="gutter">
<div class="box">
<h3>基本内容介绍，还有最新推荐</h3>
<ul>
	<li><a href"="#">研发类</a></li>
	<li><a href="#">设计类</a></li>
	<li><a href"="#">编辑类</a></li>
	<li><a href="#">涂鸦</a></li>
	<li><a href"="#">创新类</a></li>
	<li><a href="#">其他</a></li>
</ul>
</div>
</div>
</div>

<div>
<div id="footer">
<ul>
	<li><a href="/hom/">页脚</a></li>
	<li><a href="/rec/">联系</a></li>
	<li><a href="/app/">关于</a></li>
</ul>
</div>
</div>
</div>
</body>






</body>
</html>