/**
 * 
 */
var width = 320;//window.innerWidth;
var height = 510;//window.innerHeight;

var worknfightImages = [
    {id:"logo", url: "images/logo.png"},
    {id:"bgstart", url: "images/background_top.jpg"},
    {id:"numbers", url: 'images/x40.png'},
    {id:"nums", url: 'images/nums.png'},
    {id:"background", url: 'images/fondo.jpg'},
    {id:"levelbg", url: 'images/rsz_3level.png'},
    {id:"scorebg", url: 'images/score.png'},
    {id:"cloudnear", url:'images/nube1.png'},
    {id:"cloudfar", url:'images/nubefondo2.png'},
    {id:"extras", url:'images/nums40-bg.png'},
    {id:"btnstartLevel", url:'images/start.png'},
    {id:"btnEmpty", url:'images/btnEmpty.png'},
    {id:"chessbg", url:'images/chessbg320.png'},
    {id:"returnmenu", url:'images/progresive.png'},
    {id:"animals", url:"images/animals.png"},
    {id:"penddingbg", url:"images/pendding.jpg"}
];

function getLevelRand(level) {
	return level * 0.2;
}

function getLevelNumber(level) {
	return Math.floor(Math.random() * 4) + 1;
}

function getLevelBlocks(level) {
	return 20;
}

function getLevelExtras(level) {
	
}


