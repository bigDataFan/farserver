<script language="javascript">
$(document).ready(function(){
	var mainMenu = $("#mainMenu > li");
	mainMenu.children("ul").hide();
	mainMenu.hover(function(){
		$(this).children("ul").fadeIn(150);
	},function(){
        $(this).children("ul").fadeOut(150);
	});
});


</script>
<div class="header">
	<div class="container980">
		<a id="logo"></a>
		<ul id="mainMenu">
			<li>
				<span id="c_list">&nbsp;</span>
				<a href="consumerlist.html">基础资料</a>
				<ul class="children boxshadow">
					<li class="cat-item"><span>&nbsp;</span><a href="../config/tables.gs">餐位设置</a>
					</li>
					<li class="cat-item"><span>&nbsp;</span><a href="../config/dishes.gs">菜品维护</a>
					</li>
					<li class="cat-item cat-item-1028"><span>&nbsp;</span><a href="../config/combos.gs">套餐设置</a>
					</li>
					<li class="cat-item cat-item-1028"><span>&nbsp;</span><a href="http://www.1stwebdesigner.com/category/css/php-css/">员工信息</a>
					</li>
				</ul>
			</li>
			<li>
				<span id="c_actvity">&nbsp;</span>
				<a href="activities.html">营业管理</a>
				<ul class="children boxshadow">
					<li class="cat-item"><span>&nbsp;</span><a href="../open/tables.gs">店内营业</a></li>
					<li class="cat-item"><span>&nbsp;</span><a href="">收银流水</a></li>
					<li class="cat-item"><span>&nbsp;</span><a href="">外送管理</a></li>
				</ul>
			</li>
			<li>
				<span id="c_pre">&nbsp;</span>
				<a href="pre-sales.html">客户服务</a>
				<ul class="children boxshadow">
					<li class="cat-item cat-item-1027"><span>&nbsp;</span><a href="">在线点餐</a>
					</li>
					<li class="cat-item"><span>&nbsp;</span><a href="">用餐点评</a></li>
					<li class="cat-item"><span>&nbsp;</span><a href="">在线交流</a></li>
				</ul>
			</li>
		</ul>
	</div>
</div>