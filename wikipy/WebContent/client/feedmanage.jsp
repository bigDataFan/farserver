<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="org.springframework.web.context.WebApplicationContext"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="com.wikipy.job.JobDAO"%>
<%@page import="java.util.Map"%><html>


<%

WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
JobDAO jobDAO = (JobDAO)ctx.getBean("feedJobDAO");
%>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title></title>
</head>
<body>


<form method="post" action="../feed/post">
	url: <input name="feedUrl">
	uuid: <input name="uuid">
	<input type="hidden" name="type" value="feed">
	<input type="submit">
</form>

<table>
	<%for(Map jobDetail:jobDAO.listAllJobs()) { %>
	
	<tr>
		<td><%=jobDetail.get("feedUrl") %></td>
		<td><%=jobDetail.get("updated") %></td>
		<td><%=jobDetail.get("title") %></td>
		<td><%=jobDetail.get("uuid") %></td>
	</tr>
	<%} %>
	
</table>
</body>
</html>
