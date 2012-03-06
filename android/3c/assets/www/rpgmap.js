var IMAGE_INDEXES = [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];

//var IMAGE_INDEXES = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
var BWIDTH = 32;
var PLAYER_ID = 'player';

var mapScene = null;
var mapContainer = null;

var ma = [];    //the map array
var monsters = {};   //the monster inforamtions;

var npcs = [];      //npc information

var ma = [[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]];

var player = {
		x: 1,
		y: 1,
		speed: 200
};

var monsterList = [ {
	x : 3,
	y : 6,
	type : "a1",
	speed : 2000
},
{
	x : 4,
	y : 8,
	type : "a2",
	speed : 1000
},
{
	x : 8,
	y : 13,
	type : "a3",
	speed : 1000
},
{
	x : 7,
	y : 1,
	type : "a3",
	speed : 1000
},
{
	x : 7,
	y : 2,
	type : "a3",
	speed : 1000
},
{
	x : 7,
	y : 3,
	type : "a3",
	speed : 1000
},
{
	x : 7,
	y : 4,
	type : "a3",
	speed : 1000
},
{
	x : 7,
	y : 5,
	type : "a3",
	speed : 1000
},
{
	x : 7,
	y : 6,
	type : "a3",
	speed : 1000
},
{
	x : 7,
	y : 7,
	type : "a3",
	speed : 1000
}
];

function mapSceneMouseDown(me) {
	monsters[PLAYER_ID].action = 2;
	monsters[PLAYER_ID].tox = Math.floor((me.x-mapScene.x)/BWIDTH);
	monsters[PLAYER_ID].toy = Math.floor((me.y-mapScene.y)/BWIDTH);
	//alert(monsters[PLAYER_ID].tox + " " + monsters[PLAYER_ID].toy);
}

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
	 	.setChangeFPS(200)
	 	.setPosition(p.x*BWIDTH, p.y*BWIDTH);
	 	//.centerOn(p.x * BWIDTH + BWIDTH/2,  p.y*BWIDTH + BWIDTH/2);
	 mapContainer.addChild(policeMan);
	 //mapContainer.setPosition(width/2 -p.x * BWIDTH, -p.y*BWIDTH + height/2);

	 
	 var monsterInfo = new CAAT.Actor().centerOn(p.y * BWIDTH + BWIDTH/2 - BWIDTH,  p.x*BWIDTH + BWIDTH/2);
	 monsterInfo.paint = function(director, time) {
		 var ctx= director.ctx;
		 ctx.fillStyle = "#fff";
		 ctx.font="8px Arial";
		 var x = Math.floor((this.x)/BWIDTH);
		 var y = Math.floor((this.y)/BWIDTH);
		 ctx.fillText("Hi (" + x + "," + y + ")",0,0);
	 }
	 
	 mapContainer.addChild(monsterInfo);
	 
	 monsters[PLAYER_ID] = {
			  x : p.x,
			  y : p.y,
			  actor: policeMan,
			  infoactor: monsterInfo,
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
	 	.setChangeFPS(200)
	 	.setPosition(mc.x * BWIDTH,  mc.y*BWIDTH);
	 mapContainer.addChild(monster);
	 
	 
	 /*
	 var monsterInfo = new CAAT.Actor().setPosition(mc.x * BWIDTH + BWIDTH/2 - BWIDTH,  mc.y*BWIDTH + BWIDTH/2);
	 monsterInfo.paint = function(director, time) {
		 var ctx= director.ctx;
		 ctx.fillStyle = "#fff";
		 ctx.font="8px Arial";
		 
		 var x = Math.floor((this.x )/BWIDTH);
		 var y = Math.floor((this.y )/BWIDTH);
		 ctx.fillText("Hi (" + x + "," + y + ")",0,0);
	 }
	 
	 
	 mapContainer.addChild(monsterInfo);
	 */
	 monster_inc ++;
	 var id = "monster-" + monster_inc;
	 
	 monsters[id] = 
	 		{
			  x : mc.x,
			  y : mc.y,
			  actor: monster,
			  //infoactor: monsterInfo,
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
			moveToXY(id);
			break;
		case 3: //attack some actor
			break;
		case 4: //do nothing and stand alone
			moveActorInMap(id,4);
			break;
		case 0: //do nothing and make a random move;
		default:
			var d = Math.floor(Math.random() * 4);
			moveActorInMap(id, d);
			/*
			if (checkPositionInMap(id, d)) {
			} else {
				moveActorInMap(id, 4);
			}*/
			break;
	}
}

function checkPositionInMap(id, d) {
	
	switch (d) {
	case 0:
		return monsters[id].x>=0 && monsters[id].x<ma.length 
			&&monsters[id].y + 1 >=0 && monsters[id].y + 1<ma[0].length
			&&ma[monsters[id].x][monsters[id].y + 1]==0;
	case 1:
		return monsters[id].x-1>=0 && monsters[id].x-1<ma.length 
			&& monsters[id].y >=0 && monsters[id].y <ma[0].length
			&& ma[monsters[id].x-1][monsters[id].y]==0;
	case 2:
		return monsters[id].x+1>=0 && monsters[id].x+1<ma.length 
			&& monsters[id].y>=0 && monsters[id].y<ma[0].length
			&& ma[monsters[id].x+1][monsters[id].y]==0;
	case 3:
		return monsters[id].x>=0 && monsters[id].x<ma.length 
		&& monsters[id].y-1>=0 && monsters[id].y-1<ma[0].length 
		&& ma[monsters[id].x][monsters[id].y - 1]==0;
	default:
		return false;
	}
	//ma[monsters[id].x][monsters[id].y] =  monsters[id].type;
}



/**
 * 0:下
 * 1：左
 * 2：右
 * 3:上
 * */
function moveActorInMap(id, d) {
	var actor = monsters[id].actor;
	var new_x;
	var new_y;
	
	switch (d) {
	case 0:
		new_y = monsters[id].y + 1;
		new_x = monsters[id].x;
		break;
	case 1:
		new_y = monsters[id].y;
		new_x = monsters[id].x -1;
		break;
	case 2:
		new_y = monsters[id].y;
		new_x = monsters[id].x + 1;
		break;
	case 3:
		new_y = monsters[id].y - 1;
		new_x = monsters[id].x;
		break;
	default:
		new_y = monsters[id].y;
		new_x = monsters[id].x;
		break;
	}
	if (d<4 && new_x>=0 && new_x<ma.length && new_y>=0 && new_y<ma[0].length
			&& ma[new_x][new_y]==0) {
		//you can move !
		ma[monsters[id].x][monsters[id].y] = 0;
		monsters[id].x = new_x;
		monsters[id].y = new_y;
		ma[monsters[id].x][monsters[id].y] = monsters[id].type;
		actor.setAnimationImageIndex(IMAGE_INDEXES[d]).setChangeFPS(250);
	} else {
		new_y = monsters[id].y;
		new_x = monsters[id].x;
	}
	
	var path= new CAAT.LinearPath()
    .setInitialPosition(actor.x,actor.y)
    .setFinalPosition(new_x*BWIDTH, new_y*BWIDTH);
	
    var pb = new CAAT.PathBehavior()
            .setPath(path)
            .setFrameTime(actor.time, monsters[id].speed)
            .addListener({
    		    behaviorExpired : function(behavior, time, actor) {
    		    	checkMonsterAction(id);
    		    }
            });
    actor.addBehavior(pb);
    
    if (monsters[id].infoactor!=null) {
    	var infoPath= new CAAT.LinearPath()
        .setInitialPosition(monsters[id].infoactor.x,monsters[id].infoactor.y)
        .setFinalPosition(new_x*BWIDTH , new_x*BWIDTH - 20);
    	var infoBh = new CAAT.PathBehavior()
        .setPath(path)
        .setFrameTime(actor.time, monsters[id].speed);
    	monsters[id].infoactor.addBehavior(infoBh);
    }
    
    /*
    if (id=='player') {
    	var path2= new CAAT.LinearPath()
    	.setInitialPosition(mapContainer.x,mapContainer.y)
    	.setFinalPosition(mapContainer.x - inc_x, mapContainer.y - inc_y);
    	var pb2 = new CAAT.PathBehavior()
    	.setPath(path2)
    	.setFrameTime(mapContainer.time, 300);
    	
    	mapContainer.addBehavior(pb2);
    }
    */
}



function moveToXY(id) {
	var info = monsters[id];
	var deltax = info.tox - info.x;
	var deltay = info.toy - info.y;
	
	if (deltax==0 && deltay==0) {
		info.tox = null;
		info.toy = null;
		info.action  = 4;
		checkMonsterAction(id);
		return;
	}
	
	if (deltay>0) {
		moveActorInMap(id, 0);
		return;
	} 
	if (deltay<0) {
		moveActorInMap(id, 3);
		return;
	}
	
	if (deltax<0) {
		moveActorInMap(id, 1);
		return;
	}
	if (deltax>0) {
		moveActorInMap(id, 2);
		return;
	}
	
}

