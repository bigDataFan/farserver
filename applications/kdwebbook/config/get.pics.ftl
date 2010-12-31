<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>

<link rel="stylesheet" type="text/css" href="../js/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css" href="../js/themes/icon.css">
<script type="text/javascript" src="../js/jquery-1.4.2.min.js"></script>
<script language="Javascript" type="text/javascript" src="../js/jquery.easyui.min.js"></script>
<link rel="stylesheet" type="text/css" href="../style.css">

<style>

img {border: none;}
.container {
	height: 360px;
	width: 910px;
	margin: -180px 0 0 -450px;
	top: 50%; left: 50%;
	position: absolute;
}
ul.thumb {
	float: left;
	list-style: none;
	margin: 0; padding: 10px;
	width: 360px;
}
ul.thumb li {
	margin: 0; padding: 5px;
	float: left;
	position: relative;
	width: 110px;
	height: 110px;
}
ul.thumb li img {
	width: 100px; 
	border: 1px solid #ddd;
	padding: 5px;
	background: #f0f0f0;
	position: absolute;
	left: 0; top: 0;
	-ms-interpolation-mode: bicubic; 
}
ul.thumb li img.hover {
	background:url(thumb_bg.png) no-repeat center center;
	border: none;
}
#main_view {
	float: left;
	padding: 9px 0;
	margin-left: -10px;
}

</style>



<script type="text/javascript"> 

$(document).ready(function(){

	$.getJSON("../service/uploads.gs",
		{
			from:0,
			total:9
		},
		function(data) {
			for(var i=0; i<data.length; i++) {
				$("ul.thumb").append('<li><a href="../service/upload.gs?id=' + data[i].content_id + '"><img src="../service/upload.gs?id=' + data[i].content_id  + '&w=100" alt="" /></a></li>');
			}
			init();
		}
	)
});


function init() {


	$("ul.thumb li").hover(function() {
	$(this).css({'z-index' : '10'});
	$(this).find('img').addClass("hover").stop()
		.animate({
			marginTop: '-110px', 
			marginLeft: '-110px', 
			top: '50%', 
			left: '50%', 
			width: '174px', 
			height: '174px',
			padding: '20px' 
		}, 200);
	
	} , function() {
	$(this).css({'z-index' : '0'});
	$(this).find('img').removeClass("hover").stop()
		.animate({
			marginTop: '0', 
			marginLeft: '0',
			top: '0', 
			left: '0', 
			width: '100px', 
			height: '100px', 
			padding: '5px'
		}, 400);
	});

//Swap Image on Click
	$("ul.thumb li a").click(function() {
		
		var mainImage = $(this).attr("href"); //Find Image Name
		$("#main_view img").attr({ src: mainImage });
		return false;		
	});
}
</script> 




</head>
<body>

<#include "../header.ftl">

<div class="mainbody">
	<div class="container980" style="padding-top: 10px;  min-height: 360px;">
		<ul class="thumb">
		</ul>
		
		<div id="main_view">
			<a title="Design Bombs - Web Gallery" target="_blank"><img src="" alt="" /></a><br />
			<small style="float: right; color: #999;">Tutorial by <a style="color: #777;" href="#">上一页</a> | <a style="color: #777;" href="#">下一页</a></small>
		</div>
	
	</div>
	
</div>

<div class="footer">

<div id="copyright">
    <span>&copy;2010 凯迪餐饮行业用户支持系统  <a title="凯迪餐饮行业用户支持系统 " href="mailto:liuhann@gmail.com">联系作者</a>.  </span>
</div>

</div>


</body>
</html>