
var director;
var mapScene;
var mapContainer;
var squareContainer;
var numbers = ['1-7','4-7','5-8','3-8','a-3'];

var calarrays = [
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0]
];

var actorsPlaced =
[
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0]
];


var numberActors = [];
var numberImages = null;
var extraImages =  null;

function boot() {
	director = new CAAT.Director().initialize(
	        width, height,
	        document.getElementById('container'));
	
	mapScene = director.createScene();
	
	new CAAT.ImagePreloader().loadImages(
			worknfightImages,
			function(counter, images) {
				 if (counter==worknfightImages.length) {
					director.setImagesCache(images);
					initLevelsScene();
				 }
			}
	);
	CAAT.loop(30);
}


function initLevelsScene() {
	
	mapContainer = new CAAT.ActorContainer().
	setBounds(0, 0, director.width, director.height);
	mapScene.addChild(mapContainer);

	squareContainer = new CAAT.ActorContainer().
	setBounds(0, director.height-400, 320, 400);
	mapScene.addChild(squareContainer);


	var progressbg = new CAAT.Actor()
   	.setBounds(100, -50, 500, 50)
   	.setFillStyle('#fff').setAlpha(0.2);
	squareContainer.addChild(progressbg);
	
	
	numberImages= new CAAT.SpriteImage().
	initialize(director.getImage('numbers'), 9, 9);
	extraImages =  new CAAT.SpriteImage().
	initialize(director.getImage('extras'), 1, 9);
	
	var bgimage= new CAAT.SpriteImage().
	initialize(director.getImage('background'), 1, 1);

	
	
	mapContainer.setBackgroundImage(bgimage.getRef(), true).setBackgroundImageOffset(-200,-1000);
	
	var levelImage = new CAAT.SpriteImage().
		initialize(director.getImage('levelbg'), 1, 1);
	var levelContainer = new CAAT.ActorContainer()
		.setBackgroundImage(levelImage.getRef(), true)
		.setBounds(5, 5, levelImage.singleWidth, levelImage.singleHeight);
	mapScene.addChild(levelContainer);

	var scoreImage = new CAAT.SpriteImage().
	initialize(director.getImage('scorebg'), 1, 1);
	var scoreContainer = new CAAT.ActorContainer()
	.setBackgroundImage(scoreImage.getRef(), true)
	.setBounds(director.width - scoreImage.singleWidth, 0, scoreImage.singleWidth, scoreImage.singleHeight);
	mapScene.addChild(scoreContainer);
	
	var numberW= numberImages.singleWidth;
	var numberH= numberImages.singleHeight;

	_pushInNumber();
	squareContainer.mouseDown = placeNumber;
	
	
	if (scoreActors.length==0) {
		for ( var i = 0; i < 6; i++) {
			var numImages= new CAAT.SpriteImage().
			initialize(director.getImage('nums'), 1, 10);
			
			var actor= new CAAT.Actor()
			.setBackgroundImage(numImages.getRef(),true)
			.setSpriteIndex(0)
			.setPosition(i*numImages.singleWidth + 8, 20);
			scoreContainer.addChild(actor);
			scoreActors.push(actor);
		}
	}
	flyNearCloud('cloudfar', 2);
	flyNearCloud('cloudnear', 1);
}

function flyNearCloud(image, speed) {
	var cloudnear= new CAAT.SpriteImage().
	initialize(director.getImage(image), 1, 1);
	var cloudNearActor= new CAAT.Actor()
	.setBackgroundImage(cloudnear.getRef(),true);

	var clourdNearY = Math.random() * director.height;
	
	var path= new CAAT.LinearPath()
	.setInitialPosition(-cloudnear.singleWidth, clourdNearY)
	.setFinalPosition(director.width , clourdNearY);

	var pb = new CAAT.PathBehavior()
	  .setPath(path)
	  .setFrameTime(mapScene.time, 30000 * speed)
	  .addListener( {
        behaviorExpired : function(behavior, time, actor) {
        	actor.setExpired(0);
      	  	flyNearCloud(image, speed);
        }
    } );
	cloudNearActor.addBehavior(pb);
	mapContainer.addChild(cloudNearActor);
}

var scoreActors = [];
var score = 0;
function setScore(n) {
	var str = String(n);
	var la = str.length;
	for ( var i = 0; i < 6-la; i++) {
		str = "0" + str;
	}
	var str2 = String(score);
	var lb = str2.length;
	for ( var i = 0; i < 6-lb; i++) {
		str2 = "0" + str2;
	}
	
	for ( var i = 0; i < 6; i++) {
		if (str.charAt(i) == str2.charAt(i)) {
			continue;
		}
		
		var targetNum = parseInt(str.charAt(i));
		var sourceNum = parseInt(str2.charAt(i));
		
		var ii = [];
		for(var j=0; j<targetNum-sourceNum; j++) {
			ii.push(sourceNum + j);
		}
		//scoreActors[i].setAnimationImageIndex(ii).setChangeFPS(50);
		scoreActors[i].setSpriteIndex(targetNum);
		//.setImageTransformation( CAAT.SpriteImage.prototype.TR_FLIP_VERTICAL);
	}
	score = n;
}

function placeNumber(me) {
	var ax = Math.floor(me.x / numberImages.singleWidth);
	var ay = Math.floor(me.y / numberImages.singleHeight);
	
	var info = numbers[0];
	if (info.split("-")[0]=="a") {
		var number = numbers.shift();
		var actor = numberActors.shift();
		actor.setExpired(0);
	} else {
		if (calarrays[ax][ay]!=0) return;
		var number = numbers.shift();
		var actor = numberActors.shift();
		
		calarrays[ax][ay] = number;
		actorsPlaced[ax][ay] = actor;
		
		var path= new CAAT.LinearPath()
		.setInitialPosition(actor.x, actor.y)
		.setFinalPosition(ax * numberImages.singleWidth , ay * numberImages.singleHeight);

		var pb = new CAAT.PathBehavior()
		  .setPath(path)
		  .setFrameTime(actor.time, 300)
		  .setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator())
		  .addListener( {
	          behaviorExpired : function() {
	        		checkAndRemove(ax,ay);
	          }
	      } );
		actor.addBehavior(pb);
		
		placeRandomNumber();
	}
	
	numbers.push((Math.floor(Math.random()*9)+1) + "-" + (Math.floor(Math.random()*9) + 1));
	_pushInNumber();
	
}

function placeRandomNumber() {
	var ax = Math.floor(Math.random()*calarrays.length);
	var ay = Math.floor(Math.random()*calarrays[0].length);
	
	while(calarrays[ax][ay]!=0) {
		ax = Math.floor(Math.random()*calarrays.length);
		ay = Math.floor(Math.random()*calarrays[0].length);
	}
	
	var vx = Math.floor(Math.random()*9) + 1;
	var vy = Math.floor(Math.random()*9) + 1;
	
	var actor= new CAAT.Actor()
	.setBackgroundImage(numberImages.getRef(),true)
	.setSpriteIndex((vx-1)*9 + (vy-1))
	.setPosition(ax * numberImages.singleWidth , ay * numberImages.singleHeight);
	
	calarrays[ax][ay] = vx + "-" + vy;
	
	var scaling= new CAAT.ScaleBehavior().
    setFrameTime(squareContainer.time, 300).
    setValues( .2, 1, .2, 1, .5, .5).
    addListener( {
        behaviorExpired : function() {
        	actorsPlaced[ax][ay] = actor;
        	checkAndRemove(ax,ay);
        }
    });
	actor.emptyBehaviorList();
	actor.addBehavior(scaling);
	squareContainer.addChild(actor);
}


function checkAndRemove(x,y) {
	//6  list for x 
	var xa = getPosNumber(x-2, y);
	var xb = getPosNumber(x-1, y);
	var xc = getPosNumber(x, y);
	var xd = getPosNumber(x+1, y);
	var xe = getPosNumber(x+2, y);
	var totalInc = 0;
	
	if (xa>0 && xb>0 && xc>0 && xd>0 && xe>0 && (xb-xa==xc-xb && xc-xb==xd-xc && xd-xc==xe-xd) && (Math.abs(xb-xa)==1 || xb==xa)) {
		removeBlock(x-2,y);
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		removeBlock(x+2,y);
		totalInc += xa + xb + xd + xe;
	} else if (xa>0 && xb>0 && xc>0 && xd>0 && (xb-xa==xc-xb && xc-xb==xd-xc) && (xb==xa || Math.abs(xb-xa)==1)) {
		removeBlock(x-2,y);
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		totalInc += xa + xb + xd;
	} else if (xb>0 && xc>0 && xd>0 && xe>0 && (xc-xb==xd-xc && xd-xc==xe-xd) && (xc==xb || Math.abs(xc-xb)==1)) {
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		removeBlock(x+2,y);
		totalInc += xb + xd + xe;
	} else if (xb>0 && xc>0 && xd>0 && (xc-xb==xd-xc) && (xc==xb || Math.abs(xc-xb)==1)) {
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		totalInc += xb + xd;
	} 
	if (xd>0 && xc>0 && xe>0 && (xd-xc==xe-xd) && (xd==xc || Math.abs(xd-xc)==1) ) {
		removeBlock(x+1,y);
		removeBlock(x+2,y);
		totalInc += xd + xe;
	} 
	if (xa>0 && xb>0 && xc>0 && (xb-xa==xc-xb) && (xb==xa || Math.abs(xb-xa)==1)) {
		removeBlock(x-2,y);
		removeBlock(x-1,y);
		totalInc += xa + xb;
	}
	
	var ya = getPosNumber(x, y-2);
	var yb = getPosNumber(x, y-1);
	var yc = getPosNumber(x, y);
	var yd = getPosNumber(x, y+1);
	var ye = getPosNumber(x, y+2);
	
	if (ya>0&&yb>0&&yc>0&&yd>0&&ye>0 && (yb-ya==yc-yb && yc-yb==yd-yc && yd-yc==ye-yd) && (Math.abs(yb-ya)==1 || ya==yb)) {
		removeBlock(x,y-2);
		removeBlock(x,y-1);
		removeBlock(x,y+1);
		removeBlock(x,y+2);
		totalInc += ya + yb + yd + ye;
	} else if (ya>0&&yb>0&&yc>0&&yd>0 && (yb-ya==yc-yb && yc-yb==yd-yc) && (Math.abs(yb-ya)==1 || ya==yb)) {
		removeBlock(x,y-2);
		removeBlock(x,y-1);
		removeBlock(x,y+1);
		totalInc += ya + yb + yd;
	} else if (yb>0&&yc>0&&yd>0&&ye>0 && (yc-yb==yd-yc && yd-yc==ye-yd) && (Math.abs(yc-yb)==1 || yc==yb)) {
		removeBlock(x,y-1);
		removeBlock(x,y+1);
		removeBlock(x,y+2);
		totalInc += yb + yd + ye;
	} 
	if (ya>0&&yb>0&&yc>0 && (yb-ya==yc-yb) && (Math.abs(yb-ya)==1 || ya==yb)) {
		removeBlock(x,y-2);
		removeBlock(x,y-1);
		totalInc += ya + yb;
	} 
	if (yb>0&&yc>0&&yd>0 && (yc-yb==yd-yc) && (Math.abs(yc-yb)==1 || yc==yb)) {
		removeBlock(x,y-1);
		removeBlock(x,y+1);
		totalInc += yb + yd;
	} 
	if (yc>0&&yd>0&&ye>0 && (yd-yc==ye-yd) && (Math.abs(yd-yc)==1 || yd==yc)) {
		removeBlock(x,y+1);
		removeBlock(x,y+2);
		totalInc += yd + ye;
	}

	if (totalInc>0) {
		totalInc += xc;
		removeBlock(x,y);
		setScore(score + totalInc);
	}
}


function removeBlock(x, y) {
	if (x>=0 && x<calarrays.length && y>=0 && y<calarrays[0].length) {
		var actor = actorsPlaced[x][y];
		if (actor!=null) {
			 var rotating= new CAAT.RotateBehavior().
	            setCycle(false).
	            setFrameTime(actor.time, 500).
	            setValues(0, 2*Math.PI, 0.5, 0.5).
	            addListener( {
	                behaviorExpired : function() {
	                	actor.setExpired(0);
	                	calarrays[x][y] = 0;
	                	actorsPlaced[x][y] = null;
	                }
	            } );
			 actor.addBehavior(rotating);
		}
	}
}

function getPosNumber(x, y) {
	if (x<0 || x>=calarrays.length) {
		return  -5;
	}
	
	if (y<0 || y>=calarrays[0].length) {
		return -5;
	}
	
	if (calarrays[x][y]==0) {
		return -5;
	}
	
	return parseInt(calarrays[x][y].split("-")[1]);
}

function _pushInNumber() {
	for ( var i = 0; i < numbers.length; i++) {
		if (numberActors.length<i+1) {
			numberActors.push(_createAndFly(null, i));
		} else {
			_createAndFly(numberActors[i], i)
		}
	}
}

function _createAndFly(actor, pos) {
	if (actor==null) {
		var value = numbers[pos];
		var vs = value.split("-");
		
		if (vs[0]=='a') {
				//move 
			actor= new CAAT.Actor()
			.setBackgroundImage(extraImages.getRef(),true)
			.setSpriteIndex(parseInt(vs[1]))
			.setScale(.9, .9);
		} else {
			actor= new CAAT.Actor()
			.setBackgroundImage(numberImages.getRef(),true)
			.setSpriteIndex((parseInt(vs[0])-1)*9 + parseInt(vs[1])-1);
		}
		
		var path= new CAAT.LinearPath()
		.setInitialPosition(width, -45)
		.setFinalPosition(110 + pos*(numberImages.singleWidth), -45);
		
		var pb = new CAAT.PathBehavior()
		.setPath(path)
		.setFrameTime(squareContainer.time, 500)
		.setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator());
		actor.addBehavior(pb);
		
		squareContainer.addChild(actor);
		
	} else {
		var path= new CAAT.LinearPath()
	    .setInitialPosition(actor.x,-45)
	    .setFinalPosition(110 + pos*(numberImages.singleWidth), -45);
		var pb = new CAAT.PathBehavior()
        .setPath(path)
        .setFrameTime(squareContainer.time, 500)
        .setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator());
		actor.addBehavior(pb);
	}
	return actor;
}

