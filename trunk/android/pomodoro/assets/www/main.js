/**
 * 
 */

var director;
/**
1 加载图片 
 var bgimage= new CAAT.SpriteImage().
	initialize(director.getImage('background'), 1, 1);
* 增加container
	var startContainer = new CAAT.ActorContainer().
	setBounds(0, 0, director.width, director.height);
	startScene.addChild(startContainer);
	
	
2 创建actor
var cloudNearActor= new CAAT.Actor()
	.setBackgroundImage(cloudnear.getRef(),true);
	
	.setAnimationImageIndex([1,2,3,4])
	.setChangeFPS(200)
*创造移动
	var path= new CAAT.LinearPath()
	.setInitialPosition(director.width/2 - 120, -200)
	.setFinalPosition(director.width/2 - 120 , 100);
	
	var pb = new CAAT.PathBehavior()
	  .setPath(path)
	  .setFrameTime(mapScene.time, 500);
	penddingContainer.addBehavior(pb);
 */

var leftActor;
var rightActor;
var bananaActor;
var startScene;
var direction = true;

function boot() {
	director = new CAAT.Director().initialize(
	        width, height,
	        document.getElementById('container'));
	startScene = director.createScene();
	new CAAT.ImagePreloader().loadImages(
			worknfightImages,
			function(counter, images) {
				 if (counter==worknfightImages.length) {
					director.setImagesCache(images);
					
					var bgimage= new CAAT.SpriteImage().
					initialize(director.getImage('monkeyking'), 2, 5);
					
					var scene1image= new CAAT.SpriteImage().
					initialize(director.getImage('scene1'), 1, 1);
					
					var bananaimage= new CAAT.SpriteImage().
					initialize(director.getImage('banana'), 1, 1);
					
					var startContainer = new CAAT.ActorContainer()
					.setBackgroundImage(scene1image.getRef(),true)
					.setBackgroundImageOffset(-100, -300)
					.setBounds(0, 0, director.width, director.height);
					startScene.addChild(startContainer);
					
					bananaActor = new CAAT.Actor()
					.setBackgroundImage(bananaimage.getRef(),true);
					startContainer.addChild(bananaActor);
					
					var leftContainer = new CAAT.ActorContainer()
					.setBounds(0,0,60, height);
					var rightContainer = new CAAT.ActorContainer()
					.setBounds(width-60,0, 60, height);
					
					leftContainer.mouseClick = onLeftContainerClick;
					rightContainer.mouseClick = onRightContainerClick;
					
					startContainer.addChild(rightContainer);
					startContainer.addChild(leftContainer);
					
					leftActor = new CAAT.Actor()
					.setBackgroundImage(bgimage.getRef(),true)
					.setAnimationImageIndex([1,2,3,4])
					.setChangeFPS(200);
					
					rightActor = new CAAT.Actor()
					.setBackgroundImage(bgimage.getRef(),true)
					.setAnimationImageIndex([1,2,3,4])
					.setChangeFPS(200);
					leftContainer.addChild(leftActor);
					rightContainer.addChild(rightActor);
					
					leftActor.mouseClick = onLeftActorClick;
				 }
			}
	);
	CAAT.loop(30);
}

function onLeftContainerClick(me) {
	moveActor(leftActor, me.y);
}

function onRightContainerClick(me) {
	moveActor(rightActor, me.y);
}

function onLeftActorClick(me) {
	var ox;
	var oy;
	var tx;
	var ty;
	
	if (direction) {
		ox = leftActor.x;
		oy = leftActor.y;
		tx = width - 60;
		ty = rightActor.y;
	} else {
		tx = leftActor.x;
		ty = leftActor.y;
		ox = width - 60;
		oy = rightActor.y;
	}
		
	console.log(ox + " " + oy + "  " + tx + "  " + ty);
	var path= new CAAT.LinearPath()
	.setInitialPosition(ox, oy)
	.setFinalPosition(tx, ty);
	var pb = new CAAT.PathBehavior()
	  .setPath(path)
	  .setFrameTime(startScene.time, 500);
	
	bananaActor.addBehavior(pb);
	
	direction = !direction;
}

function moveActor(actor, y) {
	var path= new CAAT.LinearPath()
	.setInitialPosition(actor.x, actor.y)
	.setFinalPosition(actor.x, y);
	
	var pb = new CAAT.PathBehavior()
	  .setPath(path)
	  .setFrameTime(startScene.time, Math.abs(y - actor.y) * 5);
	
	actor.addBehavior(pb);
}


