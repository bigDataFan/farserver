<%@page import="org.json.JSONObject"%>
<%@page import="com.wikipy.utils.JSONUtils"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
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

JSONObject jsonObject = null;
if (id!=null) {
	Map map = repositoryService.getItem(id);
	jsonObject = new JSONObject(map);
}
%>

<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title></title>
<script type="text/javascript" language="javascript" src="bajax.js"/>
<script type="text/javascript">

<script language="javascript" type="text/javascript">

window.$=function(obj){return typeof(obj)=="string"?document.getElementById(obj):obj}

function ajaxtest(){
	$("btn1").disabled=true;
	_obj = new Bajax(); 
	_obj.post("../import", $("t1").value,callback, "");	
}

function callback(req, obj) {  
	if(req.readyState == 4)  {
		$("btn1").disabled=false;
	if(req.status == 200)  {
	    alert("200  " + req.responseText);
	} else
		alert("error code=" + req.status);  	
	}
} 
</script>


</head>
<body>

<fieldset>
				<legend>To Send</legend>
				<textarea id="t1" cols="55" rows="17" style="margin-left: 2px; margin-right: 2px; width: 609px; ">
<%if (jsonObject!=null) { %>
	<%=jsonObject.toString() %>
<%} %>
				</textarea>
			</fieldset>		
<center><input type="button" value="SUBMIT" id="btn1" onclick="ajaxtest()"></center>

</body>
</html>