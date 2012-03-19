/**
 * 
 */
var width = 320;//window.innerWidth;
var height = 510;//window.innerHeight;

var worknfightImages = [
    {id:"numbers", url: 'images/x40.png'},
    {id:"nums", url: 'images/nums.png'},
    {id:"background", url: 'images/fondo.jpg'},
    {id:"levelbg", url: 'images/rsz_3level.png'},
    {id:"scorebg", url: 'images/score.png'},
    {id:"cloudnear", url:'images/nube1.png'},
    {id:"cloudfar", url:'images/nubefondo2.png'},
    {id:"extras", url:'images/extras.png'},
    {id:"btnstartLevel", url:'images/startLevel.png'},
    {id:"btnEmpty", url:'images/btnEmpty.png'},
    {id:"chessbg", url:'images/chessbg320.png'}
   
];


function getLevelRand(level) {
	return level * 0.2;
}

function getLevelBlocks(level) {
	return level * 50;
}

function getLevelExtras(level) {
	
}