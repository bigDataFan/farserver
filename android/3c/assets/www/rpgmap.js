var IMAGE_INDEXES = [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];

/**
 * 0:下
 * 1：左
 * 2：右
 * 3:上
 * */
var DIR_DOWN = 0;
var DIR_RIGHT = 1;
var DIR_LEFT = 2;
var DIR_UP = 3;
var DIR_NONE = 4;

var BWIDTH = 32;
var PLAYER_ID = 'player';

var mapScene = null;
var mapContainer = null;

var ma = [];    //the map array
var monsters = {};   //the monster inforamtions;

var npcs = [];      //npc information

//var ma = [[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]];
var ma = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
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
	
	var tox = Math.floor((me.x-mapScene.x)/BWIDTH);
	var toy = Math.floor((me.y-mapScene.y)/BWIDTH);
	
	
	var bubble = new CAAT.ShapeActor().
      setLocation(tox * BWIDTH, toy * BWIDTH).
      setSize(24, 24).
      enableEvents(false).
      setFillStyle('red').
      setCompositeOp('lighter');
	
	mapContainer.addChild(bubble);
	
	monsters[PLAYER_ID].tox = tox;
	monsters[PLAYER_ID].toy = toy;
	//alert(monsters[PLAYER_ID].tox + " " + monsters[PLAYER_ID].toy);
}

function monsterMouseDown(me) {
	monsters[PLAYER_ID].action = 3;
	monsters[PLAYER_ID].enemyId = me.source.getId(); 
}

function loadMap() {
	var mapImage = new CAAT.SpriteImage().initialize(director.getImage('map'), 1,1);
	mapContainer.setBackgroundImage(mapImage.getRef(),  true);
	mapContainer.mouseDown = mapSceneMouseDown;
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
	 	.setPosition(p.x*BWIDTH, p.y*BWIDTH - BWIDTH/2);
	 	//.centerOn(p.x * BWIDTH + BWIDTH/2,  p.y*BWIDTH + BWIDTH/2);
	 mapContainer.addChild(policeMan);
	 
	 /*
	 mapContainer.setPosition(width/2 -p.x * BWIDTH, -p.y*BWIDTH + height/2);
	  */
	 
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
			  attackSpeed: 1000,
			  type : PLAYER_ID,
			  attackRange: 3,
			  life: 1000,
			  damage: 31
	 };
	 checkMonsterAction(PLAYER_ID);
}

var monster_inc = 0;

function loadMonster(mc) {
	 var monster = new CAAT.Actor().setBackgroundImage(monstersImages[mc.type].getRef(), true)
	 	.setAnimationImageIndex([0,1,2,3])
	 	.setChangeFPS(200)
	 	.setPosition(mc.x * BWIDTH,  mc.y*BWIDTH - BWIDTH/2);
	 mapContainer.addChild(monster);
	 
	 monster_inc ++;
	 var id = "monster-" + monster_inc;
	 monster.setId(id);
	 monsters[id] = 
	 		{
			  x : mc.x,
			  y : mc.y,
			  actor: monster,
			  action: 0,
			  speed: mc.speed,
			  type : mc.type,
			  attackSpeed: 1500,
			  attackRange: 1,
			  life: 120,
			  damage: 12
	 		};
	 ma[monsters[id].x][monsters[id].y] = 1;
	 checkMonsterAction(id);
	 

	 monster.mouseDown = monsterMouseDown;
	 
}

var ACTION_FOLLOW = 1;
var ACTION_ATTACK = 3;

function checkMonsterAction(id) {
	if (monsters[id]==null) return;
	var action = monsters[id].action;
	
	switch (action) {
		case ACTION_FOLLOW: //follow other actor
			var fid = monsters[id].followId;
			if (Math.abs(monsters[fid].x - monsters[id].x) + Math.abs(monsters[fid].y - monsters[id].y)>1) {
				moveToXY(id, monsters[fid].x, monsters[fid].y);
			} else {
				moveActorInMap(id,4);
			}
			break;
		case 2: //move to some position\
			moveToXY(id, monsters[id].tox, monsters[id].toy);
			break;
		case ACTION_ATTACK: //attack some actor
			var hid = monsters[id].enemyId;
			if (hid!=null) {
				if ((Math.abs(monsters[id].x-monsters[hid].x) 
						+ Math.abs(monsters[id].y-monsters[hid].y))<=monsters[id].attackRange) {
					// in range  do attack;
					doAttackTo(id, hid);
				} else {
					moveToXY(id, monsters[hid].x, monsters[hid].y);
				}
				break;
			} 
			moveActorInMap(id,4);
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
	
	var delta_x = 0;
	var delta_y = 0;
	if (d<4 && new_x>=0 && new_x<ma.length && new_y>=0 && new_y<ma[0].length
			&& ma[new_x][new_y]==0) {
		//you can move !
		ma[monsters[id].x][monsters[id].y] = 0;
		delta_x = (new_x - monsters[id].x) * BWIDTH;
		delta_y = (new_y - monsters[id].y) * BWIDTH;
		monsters[id].x = new_x;
		monsters[id].y = new_y;
		ma[monsters[id].x][monsters[id].y] = id;
		actor.setAnimationImageIndex(IMAGE_INDEXES[d]).setChangeFPS(250);
	} else {
		new_y = monsters[id].y;
		new_x = monsters[id].x;
	}
	//mapContainer.setZOrder(actor, new_y);
	
	var path= new CAAT.LinearPath()
    .setInitialPosition(actor.x,actor.y)
    .setFinalPosition(actor.x + delta_x, actor.y + delta_y);
	
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
    	if ((delta_x>0 && new_x*BWIDTH+128>width-mapContainer.x && width - mapContainer.x <=mapContainer.width-BWIDTH)
    		|| (delta_x<0 && new_x*BWIDTH-128<-mapContainer.x && mapContainer.x<=-BWIDTH)
    		|| (delta_y>0 && new_y*BWIDTH+128>height-mapContainer.y && height - mapContainer.y <=mapContainer.height-BWIDTH)
    		|| (delta_y<0 && new_y*BWIDTH-128<-mapContainer.y && mapContainer.y<=-BWIDTH)) {
    		var path2= new CAAT.LinearPath()
    		.setInitialPosition(mapContainer.x,mapContainer.y)
    		.setFinalPosition(mapContainer.x - delta_x, mapContainer.y - delta_y);
    		var pb2 = new CAAT.PathBehavior()
    		.setPath(path2)
    		.setFrameTime(mapContainer.time, player.speed);
    		
    		mapContainer.addBehavior(pb2);
    	}
    }
}

function moveToXY(id, x, y) {
	var info = monsters[id];
	var deltax = x - info.x;
	var deltay = y - info.y;
	
	if (deltax==0 && deltay==0) {
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

function doAttackTo(srcid, targetid) {
	monsters[targetid].life -= monsters[srcid].damage;
	
	var targetActor = monsters[targetid].actor;
	
	if (monsters[targetid].x > monsters[srcid].x) {
		monsters[srcid].actor.setAnimationImageIndex(IMAGE_INDEXES[DIR_LEFT]);
	} else if (monsters[targetid].x < monsters[srcid].x ) {
		monsters[srcid].actor.setAnimationImageIndex(IMAGE_INDEXES[DIR_RIGHT]);
	} else if (monsters[targetid].y > monsters[srcid].y ) {
		monsters[srcid].actor.setAnimationImageIndex(IMAGE_INDEXES[DIR_DOWN]);
	} else if (monsters[targetid].y < monsters[srcid].y ) {
		monsters[srcid].actor.setAnimationImageIndex(IMAGE_INDEXES[DIR_UP]);
	}
	
	if (monsters[targetid].life>0) {
		var path= new CAAT.LinearPath()
	    .setInitialPosition(targetActor.x,targetActor.y-30)
	    .setFinalPosition(targetActor.x,targetActor.y-10);
		
	    var textActor = new CAAT.TextActor()
	    	.setFont("10px sans-serif")
	    	.setText("-" + monsters[srcid].damage);
	    
	    mapContainer.addChild(textActor);
	    
	    var pb = new CAAT.PathBehavior()
	    .setPath(path)
	    .setFrameTime(targetActor.time, monsters[srcid].attackSpeed)
	    .addListener({
	    	behaviorExpired : function(behavior, time, actor) {
	    		actor.setExpired(0);
	    		checkMonsterAction(srcid);
	    	}
	    });
	    textActor.addBehavior(pb);
	    monsters[targetid].action = ACTION_ATTACK;
	    monsters[targetid].enemyId = srcid;
	} else {
		monsters[srcid].action = 4;
		monsters[srcid].enemyId = null;
		targetActor.setExpired(0);
		ma[monsters[targetid].x][monsters[targetid].y] = 0;
		monsters[targetid] = null;
		checkMonsterAction(srcid);
	}
	
	
}
