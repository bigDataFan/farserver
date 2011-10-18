<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="org.springframework.web.context.WebApplicationContext"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="com.ever365.open.qq.QQInfoClient"%>
<%@page import="java.util.Map"%>
<%@page import="com.ever365.security.SetUserFilter"%>
<%@page import="com.ever365.security.AuthenticationUtil"%><html>
<head>
<title>时间记录小助手</title>

<script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.2.min.js"></script>
<script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.10/jquery-ui.min.js"></script>

<link rel="stylesheet" type="text/css" href="http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.10/themes/ui-lightness/jquery-ui.css"/>

<script type="text/javascript" src="/office/365time/time.js"> </script>
<link rel="stylesheet" type="text/css" href="/office/365time/time.css"/>


<script type="text/javascript">

$(document).ready(function() {
	office.time.load();
	$( "#datepicker" ).datepicker({
		autoSize: true,
		onSelect: function(dateText, inst) {
			var dateArray = dateText.split("/");
			office.time.listDay(dateArray[2] + "-" + dateArray[0] + "-" + dateArray[1]);
		},
		monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		dayNamesMin: ['日','一','二','三','四','五','六']
	});
});


$.urlParam = function(name){ var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href); if (!results) { return 0; } return results[1] || 0;}


</script>
</head>
<body>

<div class="header-back-l"><div class="header-back-r"><div class="header-back-c">

	<div class="logo section">
		时间记录小助手
	</div>
	<div class="buttons headeroper" id="helloLink" style="display: none">
		<span></span>|<a class="fixed hidden" href="/logout?redirect=/office/365time/main.html" >注销</a>
	</div>
	  
	 <div class="buttons headeroper" id="loginLink" style="display: none">
		<a class="fixed hidden" id="queueLink" href="/office/login.jsp?redirectTo=/office/365time/main.html" >登陆</a>
	</div>
	
	<!-- 以下为QQ平台特别开发 -->
	<%

WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
QQInfoClient openqq = (QQInfoClient) ctx.getBean("openqq");

Map<String, Object> ifo = null;
if (request.getParameter("openid")!=null && request.getParameter("openkey")!=null) {
	ifo = openqq.getCurrentUserInfo(request.getParameter("openid"), request.getParameter("openkey"));
	
	if (ifo!=null && ifo.get("ret").equals(0)) {
		request.getSession().setAttribute(SetUserFilter.AUTHENTICATION_USER, "3rd." + request.getParameter("openid"));
		AuthenticationUtil.setCurrentUser("3rd." + request.getParameter("openid"));
	}
}

%>

	<%if (ifo!=null) { %>
		<div class="buttons headeroper " id="thirdPartyLink" style="display: none">
			<%=ifo.get("nickname") %>
		</div>
	<%} %>
	<div class="buttons headeroper">
		<a class="fixed hidden" id="queueLink" href="/office/365time/help.html">帮助</a>
	</div>
</div></div></div>



           	<div class="timeTemplate itemcontainer" style="display: none">
           		<div class="timeDesc"> </div>
           		<div class="timeStatics">启动于 <span class="timeStart"></span> &nbsp;&nbsp; 中断 <span class="timePending"></span>次 &nbsp;&nbsp;  <a class="details" href="#">操作</a> <span class="warning" style="display:none">已记录了指定时长</span></div>
           		<!--  <div class="timeDura">12:00</div>  -->
           		<div class="timeOper">
           			<a href="#"><span>12:00</span></a>
           		</div>
           	</div>
           	
           	
           		<div class="list" id="timelist">
           			<div class="title">
           				<div class="opers addItem" >
							<a class="btn-1" href="javascript:office.time.showAddTime();">增加事项</a>
						</div>
           			</div>
           			
	           		<div id="hintinfo" class="page-info" style="border-bottom:1px dashed #DDD;">
	           			<h3><i class="i-hint ico-inf"></i>本日还没有对事务进行时间记录！ <a href="javascript:office.time.hideInfo()">关闭</a></h3>
	           			<p>时间小贴士一：设立明确的目标<br>时间管理的目的是让你在最短时间内实现更多你想要实现的目标。把计划的4到10个目标写出来，找出一个核心目标，并依次排列重要性，然后依照你的目标设定详细的计划，并依照计划进行。</p>
	           		</div>
	           		
	           		
	           		
	           		<div id="itemedit" class="details" style="display: none">
						<div class="label">
							时间项名称  <input type="text" id="editTime"> 
						</div>
						<div class="label">
							超过<input type="text" id="autoStop" size="4" value="8"> 小时此事项自动结束
						</div>
						<!--
						<div class="label sharetosina"  style="display: none;">
							<a  href="javascript:office.time.sinaShareMessage()">共享到新浪微博</a>
						</div>
						-->
						<div class="label">
							<a class="operations" href="javascript:office.time.updateItem();">保存</a> <a class="operations" href="javascript:office.time.removeItem();">删除任务</a>    
							<a class="operations" href="javascript:office.time.hideEdit();">取消</a> 
						</div>
					</div>
			
           		</div>
<div class="nav">
 			<ul>
 				<li>
 					<span class="title">总计用时</span>
 					<div class="total">
 						00:00
 					</div>
 				</li>
 				<li>
 					<span class="title">统计信息</span>
 					<table cellspacing="0" cellpadding="0" class="tbl tbl-timesummary" id="tbl-timesummary">
						<tbody>
					
						<tr>
							<td onmouseout="this.style.backgroundColor='transparent'" onmouseover="this.style.backgroundColor='white'" class="big_link" style="background-color: transparent; ">
							  <a href="#" onclick="genTodayGraph()">
							    <span class="type-smallgrey">昨日统计</span>
							    <span id="yesterdayTime" class="type-largehours">0:00</span>
							  </a>
							</td>
							<td onmouseout="this.style.backgroundColor='transparent'" onmouseover="this.style.backgroundColor='white'" class="tbl-leftborder big_link" style="background-color: transparent;">
						 	 <a href="#" onclick="genYesterdayGraph()">
						      <span class="type-smallgrey">本周统计</span>
						      <span id="weekTime" class="type-largehours">0:00</span>
						    </a>
						 	</td>
						</tr>
						<tr>
						  <td onmouseout="this.style.backgroundColor='transparent'" onmouseover="this.style.backgroundColor='white'" class="big_link" style="background-color: transparent; ">
						  <a href="#" onclick="genWeekyGraph()">
						    <span class="type-smallgrey">条目总计</span>
						    <span id="itemCount" class="type-largehours"></span>
						  </a>
						</td>
						<td onmouseout="this.style.backgroundColor='transparent'" onmouseover="this.style.backgroundColor='white'" class="tbl-leftborder big_link" style="background-color: transparent;">
						      <a href="#">
						        <span class="type-smallgrey">时间累计</span>
						        <span id="totalTime" class="type-largehours"></span>
						      </a>
						    </td>
						  </tr>
					 
					</tbody></table>
     				</li>
				<li>
     					<span class="title">时间日历</span>
     					<div id="datepicker" style="width: 200px;"></div>
     				</li>
     				
     			</ul>
</div>
			

			

</body>
</html>