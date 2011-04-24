<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="org.springframework.web.context.WebApplicationContext"%>
<%@page import="com.wikipy.repository.RepositoryService"%>
<%@page import="java.util.Map"%><html>
<head>

<%

WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
RepositoryService repositoryService = (RepositoryService) ctx.getBean("repositoryService");
String id = request.getParameter("id");

Map<String, Object> map = null;
if (id!=null) {
	map = repositoryService.getItem(id);
}

%>

<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title></title>
</head>
<body>



<form method="Post" action="../post" enctype="multipart/form-data" >

<%if(map!=null) { 
	for(String key: map.keySet()) {
%>
		<%=key %> <input name="<%=key %>" value="<%=map.get(key) %>"></input>
<%	
	}
%>

<%} else { %>
parent:<input name="_parentid" value="<%=request.getParameter("parentid") %>">

name:<input name="_name">

title: <input name="_title">

desc: <input name="_desc">

<%} %>
<input type="submit">
	
</form>

</body>
</html>