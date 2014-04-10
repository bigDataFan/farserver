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
<meta charset="UTF-8">
<title></title>

<%

response.setContentType("text/html;charset=UTF-8");

PublicService publicService = (PublicService)ContextLoaderListener.getCurrentWebApplicationContext().getBean("rest.public");
Object user = session.getAttribute(LoginServlet.SESSION_USER);

Map<String, List<Object>> homeData = publicService.homeData();

if (homeData==null) {
	publicService.initHomeData();
	homeData = publicService.homeData();
}

List<Object> splash =  homeData.get("Splash");
List<Object> recList = homeData.get("首页推荐");
List<Object> hotList = homeData.get("热门");
List<Object> recentList = homeData.get("recent");

%>

<script type="text/javascript" language="javascript" src="js/jquery-1.7.2.min.js"></script>
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

	<div class="nav"><a href="/web/home.html">我的资源库</a></div>
	
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
	<div class="logo row">
		<img src="../img/mazepin.png">
  
	</div>
	<div class="list row">
	

	
	<%
		if (splash.size()>=1) {
			Map<String, Object> splashOne = (Map<String, Object>)splash.get(0);
	%>		
		<div class="article slide">
			<a>
				<img class="article-image" src="/pub/file/image?id=<%=splashOne.get("tn")%>">
				<h1 class="article-title"><%=splashOne.get("name") %></h1>
				
				<ul class="meta">
          			<li>
          				<span class="publisher"><%=splashOne.get("creator") %></span>• 
          				<time datetime="2014-03-06T07:56:41+00:00" pubdate="pubdate">1 小时前</time>
          			</li>
        		</ul>
			</a>
		</div>
			
	<%		
		}
	%>
		
		<div class="recommend">
			<h2>
				推荐
			</h2>
			
			<%
				Integer count = 0;
				for(Object o : recList) {
					if (count>=4) {
						break;
					}
					Map<String, Object> recommend = (Map<String, Object>)o;
			%>
					<div class="view">
						<img class="article-image" src="/pub/file/image?id=<%=recommend.get("tn")%>">
						<h1 class="article-title"><%=recommend.get("name") %></h1>
					</div>			
						
			<%
				}
			%>
		</div>
		
	</div>

	<div class="sep-title">
		<i class="recent icon"></i>最新展示
	</div>
	<div class="pager row">
			<%
				for(Object o : recentList) {
					Map<String, Object> recent = (Map<String, Object>)o;
			%>
				
					<div class="article">
						<a>
							<img class="article-image" src="/pub/file/image?id=<%=recent.get("tn")%>">
							<h1 class="article-title"><%=recent.get("name") %></h1>
							
							<ul class="meta">
			          			<li>
			          				<span class="publisher"><%=recent.get("creator") %></span>• 
			          				<time datetime="2014-03-06T07:56:41+00:00" pubdate="pubdate">1 小时前</time>
			          			</li>
			        		</ul>
						</a>
					</div>
						
			<%
				}
			%>
		
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
