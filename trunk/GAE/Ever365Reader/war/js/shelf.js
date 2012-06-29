var books;

$(document).ready(function(){
	$.getJSON("/service/key/get",
			{
				"kind":"reader",
				"key":"books"
			},
			function(data) {
				
				if (data.user.indexOf("guest.")==0) {
					//guest
					$('#info').html("您未登录。 登录后可以上传多本图书并拥有书架");
					$('#login').show();
					$("#file_upload_1").uploadify({
						'fileTypeDesc' : '选择TXT文本文件',
						'fileTypeExts' : '*.txt',
						'fileSizeLimit' : '1MB',
						'multi': false,
						'buttonText':"选择TXT文件",
						height        : 30,
						swf           : '/uploadify.swf',
						uploader      : '/upload?t=' + data.ticket,
						width         : 120,
						onUploadSuccess : function(file, data, response) {
							openBook(data);
				        }
					});
				} else {
					$('#info').html("您好, " + data.user);
					$('#login').hide();
					$("#file_upload_1").uploadify({
						'fileTypeDesc' : '选择TXT文本文件',
						'fileTypeExts' : '*.txt',
						'fileSizeLimit' : '2MB',
						'buttonText':"选择TXT文件",
						height        : 30,
						swf           : '/uploadify.swf',
						uploader      : '/upload?t=' + data.ticket,
						width         : 120,
						onUploadSuccess : function(file, data, response) {
							var book = {};
							book.title = file.name.toLowerCase().split('.txt')[0];
							book.key = data;
							addBook(book);
						}
					
					});
					
					books = JSON.parse(data.value);
					
					for ( var i = 0; i < books.length; i++) {
						addBook(books[i]);
					}
				}
			});
	
});



function addBook(book) {
	$('#booklist').append('<li><a href="javascript:openBook(\'' + book.key + '\')">' + book.title + '</a></li>');
}


function openBook(id) {
	
	if (books==null) {
		location.href = "reading.html?key=" + id + "&loc=0";
	} else {
		var loc = 0;
		for ( var i = 0; i < books.length; i++) {
			if (books[i].key==id) {
				if (books[i].pos!=null) {
					loc = books[i].pos;
				}
				break;
			}
		}
		
		location.href = "reading.html?key=" + id + "&loc=" + loc;
	}
	
}