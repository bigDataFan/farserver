/**
 * outer map related
 */

var policeMan;

var hash;

var playerActorId = null;

var monstersImages = {};


function boot() {
	director = new CAAT.Director().initialize(
	        width, height,
	        document.getElementById('container'));
	
	hash= new CAAT.SpatialHash().initialize( director.width, director.height, 10, 16);
	
	
	mapScene = director.createScene();
	mapContainer = new CAAT.ActorContainer().
		setBounds(0, 0, director.width, director.height);
	
	mapScene.addChild(mapContainer);
	
	new CAAT.ImagePreloader().loadImages(
			worknfightImages,
			function(counter, images) {
				 if (counter==worknfightImages.length) {
					director.setImagesCache(images);
					loadMap();
					var image1 = new CAAT.SpriteImage().initialize(director.getImage('a1'), 4,4);
					var image2 = new CAAT.SpriteImage().initialize(director.getImage('a2'), 4,4);
					var image3 = new CAAT.SpriteImage().initialize(director.getImage('a3'), 4,4);
					var image4 = new CAAT.SpriteImage().initialize(director.getImage('a4'), 4,4);
				
					monstersImages["a1"] = image1;
					monstersImages["a2"] = image2;
					monstersImages["a3"] = image3;
					monstersImages["a4"] = image4;
					loadPlayer(player);
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
	CAAT.loop(30);
}




