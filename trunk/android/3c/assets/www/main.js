/**
 * 
 */

/**
 * outer map related
 */

var mapScene = null;
var mapContainer = null;
var policeMan;


var hash;

actorDirections = {};

var default_Indexes = [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];

function boot() {
	director = new CAAT.Director().initialize(
	        width, height,
	        document.getElementById('container'));
	
	hash= new CAAT.SpatialHash().initialize( director.width, director.height, 10, 16 );
	
	
	mapScene = director.createScene();
	mapContainer = new CAAT.ActorContainer().
		setBounds(0, 0, director.width, director.height);
	
	mapScene.addChild(mapContainer);
	
	new CAAT.ImagePreloader().loadImages(
			worknfightImages,
			function(counter, images) {
				 if (counter==worknfightImages.length) {
					 director.setImagesCache(images);
					 
					 
					 var mapImage = new CAAT.SpriteImage().initialize(director.getImage('map'), 1,1);
					 
					 var policeImage = new CAAT.SpriteImage().initialize(director.getImage('police'), 4,4);
					 
					 
					 mapContainer.setBackgroundImage(mapImage.getRef(),  true);
					 
					 policeMan = new CAAT.Actor().setBackgroundImage(policeImage.getRef(), true)
					 	.setAnimationImageIndex([0,1,2,3])
					 	.setChangeFPS(250);
					 mapContainer.addChild(policeMan);
					 mapContainer.mouseDown = mapSceneMouseDown;
					 
					 policeMan.setupCollission(true,true);
					 
					 loadMonsters();
					 //mapContainer.mouseUp = mapSceneMouseUp;
					 //mapContainer.mouseDrag = mapSceneMouseDrag;
					 /*
					 var pathBehavior = new CAAT.PathBehavior()
					 	.setFrameTime( splashActor.time, 1000 )
					 	.setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator())
					 	.setValues(
					 			new CAAT.Path().setLinear(
					 					width/2-130,
					 					-100,
					 					width/2-130,
					 					50)
					 			 );
					 splashActor.addBehavior(pathBehavior);
					 acontainer.addChild(splashActor);
					*/
				 }
			}
	);
	CAAT.loop(60);
}

var moving = false;

/**
 * 0:下
 * 1：左
 * 2：右
 * 3:上
 * */
function move(actor, direction) {
	actorDirections[actor.getId()] = direction;
	actor.setAnimationImageIndex(default_Indexes[direction]).setChangeFPS(250);
	var inc_x;
	var inc_y;
	
	switch (direction) {
	case 0:
		inc_x = 0;
		inc_y = block_width;
		break;
	case 1:
		inc_x = -block_width;
		inc_y = 0;
		break;
	case 2:
		inc_x = block_width;
		inc_y = 0;
		break;
	case 3:
		inc_x = 0;
		inc_y = -block_width;
		break;
	default:
		break;
	}
	
	var path= new CAAT.LinearPath()
    .setInitialPosition(actor.x,actor.y)
    .setFinalPosition(actor.x + inc_x, actor.y + inc_y);
	
    var pb = new CAAT.PathBehavior()
            .setPath(path)
            .setFrameTime(actor.time, 300)
            .addListener({
    		    behaviorExpired : function(behavior, time, actor) {
    		    	checkMove(actor);
    		    	//actor.setAnimationImageIndex([default_Indexes[direction][0]]);
    		    }
            });
    actor.addBehavior(pb);
    moving = true;
    
    if (actor.x > width/2 && actor.y>height/2) {
    	if (mapContainer.x-inx_x>=0 || mapContainer.y - inc_y>=0) return; 
    	
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

function monsterMouseDown(me) {
	attack(policeMan, me.source);
}

function mapSceneMouseUp(me) {
	mouseDown_x = 0;
	mouseDown_y = 0;
}

var mouseDown_x;
var mouseDown_y;

function mapSceneMouseDown(me) {
	mouseDown_x = me.x;
	mouseDown_y = me.y;
	if (moving) return;
	//alert(policeMan.width + "  " + policeMan.height);
	checkMove(policeMan);
	//walkTo(policeMan, {x:me.x, y:me.y});
}

function checkMove(actor) {
	return;
	if (mouseDown_x==0 && mouseDown_y==0) {
		actor.setAnimationImageIndex([default_Indexes[actorDirections[actor.getId()]][0]]);
		moving = false;
		return;
	}
	
	var delta_x = mouseDown_x - actor.x;
	var delta_y = mouseDown_y - actor.y;

	if (Math.abs(delta_x)>block_width) {
		if (delta_x > 0) {
			move(actor, 2);
			return;
		} else {
			move(actor, 1);
			return;
		}
	} else if (Math.abs(delta_y) > block_width) {
		if (delta_y>0) {
			move(actor, 0);
			return;
		} else {
			move(actor, 3);
			return;
		}
	} else {
		actor.setAnimationImageIndex([default_Indexes[actorDirections[actor.getId()]][0]]);
		moving = false;
	}
}

function loadMap(map) {
	
}


function loadMonsters() {
	
	var image1 = new CAAT.SpriteImage().initialize(director.getImage('a1'), 4,4);
	var image2 = new CAAT.SpriteImage().initialize(director.getImage('a2'), 4,4);
	var image3 = new CAAT.SpriteImage().initialize(director.getImage('a3'), 4,4);
	var image4 = new CAAT.SpriteImage().initialize(director.getImage('a4'), 4,4);
	
	var monstersImages = [image1,image2,image3,image4];
	var monsters = [];
	
	
	for ( var i = 0; i < 40; i++) {
		var posx = Math.random() * mapContainer.width;
		var posy = Math.random() * mapContainer.height;
		
		var index = Math.floor(Math.random() * 4);
		
		 var monster = new CAAT.Actor().setBackgroundImage(monstersImages[index].getRef(), true)
		 	.setAnimationImageIndex([0,1,2,3])
		 	.setChangeFPS(250)
		 	.centerOn( posx, posy);
		 mapContainer.addChild(monster);
		 
		 
		 monster.mouseDown = monsterMouseDown;
		 
		 monsters.push(monster);
	}
	
	/*
	mapScene.createTimer( mapScene.time, Number.MAX_VALUE, null,
        function(time, ttime, timerTask) {

            //var max= Math.max( levelW, levelH );

            hash.clearObject();
            
            for( var i=0; i<monsters.length; i++ ) {
                var monster = monsters[i].AABB;

                hash.addObject( {
                    id          : i,
                    x           : monster.x,
                    y           : monster.y,
                    width       : monster.width,
                    height      : monster.height,
                    rectangular : true
                });
            }

            hash.collide( policeMan.x, policeMan.y, policeMan.width, policeMan.height, function(collide_width) {
                return true;
            });
        },
        null);
        */
}





