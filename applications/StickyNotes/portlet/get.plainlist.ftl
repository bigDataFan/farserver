<h2>待办便签</h2>
<ul>
	<#list model as note>
		<li>
			${note.data}  -${note.author}
		</li>
	</#list>
</ul>