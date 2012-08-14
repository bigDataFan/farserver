/**
 * 
 */
var width = 510;//window.innerWidth;
var height = 320;//window.innerHeight;

var worknfightImages = [
    {id:"monkeyking", url: 'images/cloudenemy.png'},
    {id:"scene1", url: 'images/scene1.jpg'},
    {id:"banana", url: 'images/banana48.png'}
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


