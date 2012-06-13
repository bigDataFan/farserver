

function synchronize(db, dbname, username) {
	//获取最近和服务器更新联系的时间
	
	var updated = $.cookie(username + "." + dbname + ".updated");
	if (updated==null) {
		updated = 0;
	} else {
		updated = parseInt(updated);
	}
	var currentTime = new Date().getTime();
	var newerString = db().filter({"updated":{'gt': updated}}).stringify();

	//IE6未同步的情况下
	if (!dbinit[dbname]) {
		updated = 0;
		newerString = "[]";
	}
	
	if (dbinit[dbname] && newerString=="[]") {
		return;
	}
	
	$.post("/service/db/sync",
			{
				'updated': updated,
				'db': dbname,
				'list': newerString
		    },  function(data) {
		    	
		    	if (!dbinit[dbname]) {
		    		db().remove();
		    	}
		    	
		    	var result = $.parseJSON(data);
		    	for ( var j = 0; j < result.updated.length; j++) {
		    		var record = result.updated[j];
		    		db.insert(record);
		    		/*
		    		record.___id = null;
		    		
		    		if(record.___id && db(record.___id).count()>0) {//表明是其他客户端执行了更新操作
		    			
		    			db(record.___id).update(record);
		    		} else {
		    			db.insert(record);
		    		}
		    		*/
				}
		    	for ( var id in result.added) {  //表明本次请求新增的数据
		    		//db(id).update({'id': result.added[id]});
		    		$('#' + id).find('div.priority img').attr('src', "online_dot.png");
				}
		    	
		    	for (var j=0; j<result.deleted.length; j++) {
					db(result.deleted[j]).remove();
				}
		    	
		    	$.cookie(username + "." + dbname + ".updated", currentTime);
		    	
		    	$('#' + dbname + 'size').html(db().count());
		    	
		    	$('#networkInfo').html('您已经连接到服务器 最近更新时间'  + new Date(currentTime).format("h:MM TT"));
		    	dbinit[dbname] = true;
		    	
		    	if (dbname=="groupdb") {
		    		initDashBoard();
		    	}
		    	/*
		    	setTimeout(function(){
		    		synchronize(db, dbname, username)
		    	}, 10000);
		    	*/
		    }
	);
}

