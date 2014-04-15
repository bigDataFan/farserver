<%@page import="com.ever365.utils.StringUtils"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<%@page import="com.ever365.ecm.service.servlet.LoginServlet"%>
<%@page import="com.ever365.ecm.authority.PersonService"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Map"%>
<%@page import="org.springframework.web.context.ContextLoaderListener"%>
<%@page import="com.ever365.ecm.service.PublicService"%>
<html>
<head>
<%
response.setContentType("text/html;charset=UTF-8");

String seq = request.getParameter("seq");
if (seq==null) {
	response.sendError(400);
	return;
}

PublicService publicService = (PublicService)ContextLoaderListener.getCurrentWebApplicationContext().getBean("rest.public");

Object user = session.getAttribute(LoginServlet.SESSION_USER);

Map<String,Object> entityMap = publicService.getCachedEntity(seq);
if (entityMap==null) {
	response.sendError(400);
	return;
}
List<Map<String, Object>> hotList =  publicService.getList("热门");
%>
<title><%=entityMap.get("name") %></title>

<meta charset="UTF-8" >

<script type="text/javascript" language="javascript" src="js/jquery-1.7.2.min.js"></script>
<script type="text/javascript" language="javascript" src="js/util.js"></script>
<script type="text/javascript" language="javascript" src="js/index.js"></script>
<link rel="StyleSheet" href="css/index.css"  type="text/css">

<script type="text/javascript">
	var person = null; 
	<%if (session.getAttribute(LoginServlet.SESSION_USER)!=null) { %>
	person = "<%=session.getAttribute(LoginServlet.SESSION_USER)%>";
	<%}%>
</script>
</head>
<body>

<div class="header">
	<a href="/"><img src="img/slide8-small.png"></a>
	<div class="login-wrapper">
		<strong class="status"><i class="user icon"></i><span> 帐户</span></strong>
		<span class="nav-dropdown">
			<strong class="guest" onclick="loginDialog();"><i class="icon login"></i> <span>登录</span></strong>
			<strong class="guest" onclick="registerDialog();"><i class="icon register"></i> 注册</strong>
			<strong class="logon" style="display:none;" onclick="logout();"><i class="icon login"></i> 退出登录</strong>
		</span>
	</div>
</div>

<div class="main">
		<div class="slideview">
			<%if(entityMap.get("ext").equals("png")) { %>
				<div class="img" style="background-image: url('/pub/file/download?id=<%=entityMap.get("id")%>')">
					<div class="upper" onclick="onUpper();">
						点击进入上一页
					</div>
					<div class="downer" onclick="onDowner();">
						点击进入下一页
					</div>
				</div>
			<% } else {%>
				<div class="img" style="background-image: url('/pub/file/download?id=<%=entityMap.get("tn")%>')">
				
				</div>
			<%} %>
			
			<div class="fns">
				<div class="bdsharebuttonbox"><a href="#" class="bds_more" data-cmd="more">分享到：</a><a href="#" class="bds_qzone" data-cmd="qzone" title="分享到QQ空间">QQ空间</a><a href="#" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博">新浪微博</a><a href="#" class="bds_tqq" data-cmd="tqq" title="分享到腾讯微博">腾讯微博</a><a href="#" class="bds_renren" data-cmd="renren" title="分享到人人网">人人网</a><a href="#" class="bds_weixin" data-cmd="weixin" title="分享到微信">微信</a></div>
				<script>window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"1","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"16"},"share":{"bdSize":16},"image":{"viewList":["qzone","tsina","tqq","renren","weixin"],"viewText":"分享到：","viewSize":"24"},"selectShare":{"bdContainerClass":null,"bdSelectMiniList":["qzone","tsina","tqq","renren","weixin"]}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];</script>
			</div>
		</div>
		
		<div class="comments">
			
		</div>
	
	
	<div class="aside">
		<div class="title">
			<a>
				<h2>
					<i class="hottest"></i>热门文件
				</h2>
			</a>
		</div>
		
		<%
				for(Object o : hotList) {
					Map<String, Object> hot = (Map<String, Object>)o;
			%>
				
				<div>
					<a class="top">
						<img class="icon" src="/pub/file/image?id=<%=hot.get("icon")%>">
						<strong><%=hot.get("name") %></strong>
						<em>23人喜欢</em>
					</a>
				</div>
			<%
				}
			%>
		
		
	</div>
</div>


<div id="modal" class="">
    <div class="modal-wrapper" id="login">
      <h2>
      	 <span>登录</span> 
      	<div class="dialog-handle"><a href="javascript:closeDialog();" class="diag-close">关闭</a></div>
      </h2>
      
      <div class="body">
        <div class="msg">
          <span class="news-tip-info">没有帐号？<a class="goto-signup" href="javascript:registerDialog();">现在注册 <i class="link-arrow"></i></a></span>
        </div>
        
		<div>
			<div class="item">
			  <span class="label">用户名</span>
			  <input type="text" name="log" id="user_login" class="input" value="" size="20">
			</div>
			<div class="item">
			  <span class="label">密码</span>
			  <input type="password" name="pwd" id="user_pass" class="input" value="" size="20">
			</div>
			<div class="item" style="margin-left: 80px;">
			  <a class="button blue"  href="javascript:login();">登录</a>
			  <a id="logon-result"></a>
			</div>
		</div>
      </div>
    </div>
    
    <div class="modal-wrapper" id="register">
      <h2>
      	 <span>用户注册</span> 
      	<div class="dialog-handle"><a href="javascript:closeDialog();" class="diag-close">关闭</a></div>
      </h2>
      
      <div class="body">
		<div>
			<div class="item">
			  <span class="label">用户名</span>
			  <input type="text" id="reg_user" class="input" value="" size="20">
			</div>
			<div class="item">
			  <span class="label">密码</span>
			  <input type="password" id="reg_user_pass" class="input" value="" size="20">
			</div>
			<div class="item">
			  <span class="label">确认密码</span>
			  <input type="password" id="reg_user_pass_cfm" class="input" value="" size="20">
			</div>
			<div class="item">
			  <span class="label">电子邮件</span>
			  <input type="text"id="reg_email" class="input" value="" size="20">
			</div>
			<div class="item " style="margin-left: 80px;">
			  <a class="button blue">注册</a> <a id="reg-result"></a>
			</div>
		</div>
      </div>
    </div>
    
    <div class="modal-bg"></div>
  </div>
  


</body>
</html>
