/**
 * 
 */

var url = "http://127.0.0.1:8080";
var min_height = 10;
var min_width = 10;

void((function(){
	var e1 = document.createElement('script');
	e1.setAttribute('src',"http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.2.min.js");
	//setTimeout("open()",1000);
	opengo();
})());


var isgo = false;

function opengo() {
	
	if (isgo) return;
	
	ifgo = true;
	
	var images = new Array();
	var divz = $('<div  style="padding:20px; border:2px solid black;position:absolute; left:100px;top:100px; display: block;z-index: 1002; background:white" title="Basic modal dialog"><p>Adding the modal overlay screen makes the dialog look more prominent because it dims out the page content.</p></div>');
	$('body').append(divz);
	
	for ( var i = 0; i < document.images.length; i++) {
		if (document.images[i].width > min_width && document.images[i].height> min_height) {
			//alert(document.images[i].src);
			//$('body').append('<img src="' + document.images[i].src + '"><br>');
			
			images.push(document.images[i].src);
		}
	}

	for ( var i = 0; i < images.length; i++) {
		$(divz).append('<img src="' + images[i] + '"><br>');
	}
	
	//window.open(url + "/clipimg/open.html?" + images);
	//location.href = url + "/clipimg/open.html?id=" + images;
	/*
	$.post(url + "/service/tools/addimg",
			{'imgs': images.toString()},
			function(data) {
			}
	)
	*/
	
}