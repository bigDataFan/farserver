var IMAGE_INDEXES = [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];
var BWIDTH = 32;
var PLAYER_ID = 'player';


var mapScene = null;
var mapContainer = null;

var ma = [];    //the map array
var monsters = {};   //the monster inforamtions;

var npcs = [];      //npc information



var ma = 
	[[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]];

var player = {
		x: 5,
		y: 14,
		speed: 500
};

var monsterList = [
                   {x:3,
                	y: 6,
                	type:"a1",
                	speed: 1000
                	   },
                	   {x:4,
                       	y: 8,
                       	type:"a2",
                       	speed: 1000
                       	   },
                	   
                	   {x:8,
                       	y: 13,
                       	type:"a3",
                       	speed: 1000
                       	   }
                  ];


function loadMap() {
	var mapImage = new CAAT.SpriteImage().initialize(director.getImage('map'), 1,1);
	mapContainer.setBackgroundImage(mapImage.getRef(),  true);
}

function loadMonsters() {
	for ( var i = 0; i < monsterList.length; i++) {
		loadMonster(monsterList[i]);
	}
}

function loadPlayer(p) {
	var policeImage = new CAAT.SpriteImage().initialize(director.getImage('police'), 4,4);
	var policeMan = new CAAT.Actor().setBackgroundImage(policeImage.getRef(), true)
	 	.setAnimationImageIndex([0,1,2,3])
	 	.setChangeFPS(250)
	 	.centerOn(p.y * BWIDTH + BWIDTH/2,  p.x*BWIDTH + BWIDTH/2);
	 mapContainer.addChild(policeMan);
	 mapContainer.setPosition(-p.y * BWIDTH - BWIDTH/2 + width/2, -p.x*BWIDTH - BWIDTH/2 + height/2);
	 
	 monsters[PLAYER_ID] = {
			  x : p.x,
			  y : p.y,
			  actor: policeMan,
			  action: 4,
			  speed: p.speed,
			  type : PLAYER_ID
	 };
	 checkMonsterAction(PLAYER_ID);
}


/*
  {
    x:2,
    y:2,
    type:32
  }
 */
var monster_inc = 0;

function loadMonster(mc) {
	 var monster = new CAAT.Actor().setBackgroundImage(monstersImages[mc.type].getRef(), true)
	 	.setAnimationImageIndex([0,1,2,3])
	 	.setChangeFPS(250)
	 	.centerOn(mc.y * BWIDTH + BWIDTH/2,  mc.x*BWIDTH + BWIDTH/2);
	 
	 mapContainer.addChild(monster);
	 
	 monster_inc ++;
	 var id = "monster-" + monster_inc;
	 
	 monsters[id] = 
	 		{
			  x : mc.x,
			  y : mc.y,
			  actor: monster,
			  action: 0,
			  speed: mc.speed,
			  type : mc.type
	 		};
	 
	 ma[monsters[id].x][monsters[id].y] = 1;
	 checkMonsterAction(id);
}

function checkMonsterAction(id) {
	var action = monsters[id].action;
	
	switch (action) {
		case 1: //follow other actor
			break;
		case 2: //move to some position
			break;
		case 3: //attack some actor
			break;
		case 4: //do nothing and stand alone
			moveActorInMap(id,4);
			break;
		case 0: //do nothing and make a random move;
		default:
			var d = Math.floor(Math.random() * 4);
			if (checkPositionInMap(id, d)) {
				moveActorInMap(id, d);
			}
			break;
	}
}

function checkPositionInMap(id, d) {
	return true;
}

/**
 * 0:下
 * 1：左
 * 2：右
 * 3:上
 * */
function moveActorInMap(id, d) {
	var actor = monsters[id].actor;
	ma[monsters[id].x][monsters[id].y] = 0;
	var inc_x;
	var inc_y;
	switch (d) {
	case 0:
		ma[monsters[id].x+1][monsters[id].y] =  monsters[id].type;
		inc_x = 0;
		inc_y = BWIDTH;
		break;
	case 1:
		ma[monsters[id].x][monsters[id].y-1] =  monsters[id].type;
		inc_x = -BWIDTH;
		inc_y = 0;
		break;
	case 2:
		ma[monsters[id].x][monsters[id].y+1] =  monsters[id].type;
		inc_x = BWIDTH;
		inc_y = 0;
		break;
	case 3:
		ma[monsters[id].x-1][monsters[id].y] =  monsters[id].type;
		inc_x = 0;
		inc_y = -BWIDTH;
		break;
	default:
		ma[monsters[id].x][monsters[id].y] =  monsters[id].type;
		inc_x = 0;
		inc_y = 0;
		break;
	}
	
	if (d<4) {
		actor.setAnimationImageIndex(IMAGE_INDEXES[d]).setChangeFPS(250);
	}
	
	var path= new CAAT.LinearPath()
    .setInitialPosition(actor.x,actor.y)
    .setFinalPosition(actor.x + inc_x, actor.y + inc_y);
	
    var pb = new CAAT.PathBehavior()
            .setPath(path)
            .setFrameTime(actor.time, monsters[id].speed)
            .addListener({
    		    behaviorExpired : function(behavior, time, actor) {
    		    	checkMonsterAction(id);
    		    }
            });
    actor.addBehavior(pb);
    
    
    if (id=='player') {
    	var path2= new CAAT.LinearPath()
    	.setInitialPosition(mapContainer.x,mapContainer.y)
    	.setFinalPosition(mapContainer.x - inc_x, mapContainer.y - inc_y);
    	var pb2 = new CAAT.PathBehavior()
    	.setPath(path2)
    	.setFrameTime(mapContainer.time, 300)
    	.addListener({
    		behaviorExpired : function(behavior, time, actor) {
    		}
    	});
    	
    	mapContainer.addBehavior(pb2);
    }
    
}

