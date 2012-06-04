/**
 * 
 */
var width = 480;//window.innerWidth;
var height = 720;//window.innerHeight;

var board_width=480;
var board_height=600;


var worknfightImages = [
    {id:"logo", url: "images/logo.png"},
    {id:"bgstart", url: "images-hd/background_top.png"},
    {id:"numbers", url: 'images-hd/numbers.png'},
    {id:"nums", url: 'images/nums.png'},
    {id:"background", url: 'images-hd/fondo.png'},
    {id:"levelbg", url: 'images/rsz_3level.png'},
    {id:"scorebg", url: 'images/score.png'},
    {id:"cloudnear", url:'images/nube1.png'},
    {id:"cloudfar", url:'images/nubefondo2.png'},
    {id:"extras", url:'images/nums40-bg.png'},
    {id:"btnstartLevel", url:'images/start.png'},
    {id:"btnEmpty", url:'images/btnEmpty.png'},
    {id:"chessbg", url:'images-hd/sb.png'},
    {id:"returnmenu", url:'images/progresive.png'},
   // {id:"animals", url:"images/animals.png"},
    {id:"penddingbg", url:"images/dialog.png"},
    //{id:"passinfo", url:"images/passinfo.png"},
    {id:"txtinfo", url:"images/txtInfo.png"},
    {id:"penddingbtn", url:"images/pendding.png"}
];

function getLevelRand(level) {
	return level * 0.2;
}

function getLevelNumber(level) {
	return Math.floor(Math.random() * 4) + 1;
}

function getLevelBlocks(level) {
	return 30;
}

function getLevelDiffs(level) {
	return level;
}

function getLevelExtras(level) {
	
}


