<h2>工作执行情况</h2>
<ul>
	<#list model.entries as entry>
		<li>
			${entry.desc} (${entry.dura})
			<#if entry.running>
				 <em>正在运行</em> <img src="${context.basePath}/images/btn_running.gif">
			</#if>
		</li>
	</#list>
</ul>