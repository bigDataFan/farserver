
$(document).ready(function(){
	$('#infoTable').datagrid({
			toolbar:[
		    	{
 		    		text:"新增",
 		    		iconCls:'icon-add',
 		    		handler:function(){
		    			location.href= editpage + "?collection=" + collections;					
					}
 				},'-',
 				{
 		    		text:"删除",
 		    		iconCls:'icon-remove',
 		    		handler:function(){
 						var rows = $('#infoTable').datagrid('getSelections');
						var ids = "";
 						for(var i=0; i<rows.length; i++) {
 	 						ids += rows[i].id + "-";
 						}

 						$.get("service/delete.gs", 
 		 						{
		 							'ids':ids,
		 						 	'collection': collections
			 					},
 		 						function(data) {
 	 		 						location.href = location.href; 	
 		 						});
					}
 				}
 				],
 			onDblClickRow:function(rowIndex, rowData) {
				location.href= editpage + "?id=" + rowData.id + "&collection=" + collections;
			},
			pagination:true,
			rownumbers:true,
			pageSize: 20,
			url: "service/list.gs?collection=" + collections
	});
});