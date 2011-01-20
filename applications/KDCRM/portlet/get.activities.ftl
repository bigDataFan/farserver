<h2>客户动态</h2>
<ul>
	<#list model as activity>
		<li>
			<em>${activity.time}</em> ${activity.name}  [${activity.consumerdisplay}]
		</li>
	</#list>
</ul>