
var director;
var mapScene;
var mapContainer;
var squareContainer;
var numbers = ['1-7','4-7','5-8','3-8','3-8'];

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

function boot() {
	director = new CAAT.Director().initialize(
	        width, height,
	        document.getElementById('container'));
	
	mapScene = director.createScene();
	mapContainer = new CAAT.ActorContainer().
		setBounds(0, 0, director.width, director.height);
	
	mapScene.addChild(mapContainer);
	squareContainer = new CAAT.ActorContainer().
	setBounds(0, director.height-400, 320, 400);
	mapScene.addChild(squareContainer);
	
	new CAAT.ImagePreloader().loadImages(
			worknfightImages,
			function(counter, images) {
				 if (counter==worknfightImages.length) {
					director.setImagesCache(images);
					
					numberImages= new CAAT.SpriteImage().
						initialize(director.getImage('numbers'), 9, 9);
					
					var bgimage= new CAAT.SpriteImage().
					initialize(director.getImage('background'), 1, 1);
					
					mapContainer.setBackgroundImage(bgimage.getRef(), true).setBackgroundImageOffset(-200,-1000);
					
		            var numberW= numberImages.singleWidth;
		            var numberH= numberImages.singleHeight;
		            
		            _pushInNumber();
		            
		            
		            squareContainer.mouseDown = placeNumber;
		            /*
					var level = levels[0];
					
					
					for ( var i = 0; i < level.length; i++) {
						for ( var j = 0; j < level[i].length; j++) {
							if (level[i][j]!=0) {
								var number= new CAAT.Actor()
								.setBackgroundImage(numberImages.getRef(),true)
								.setLocation(j*numberW, i*numberH)
								.setSpriteIndex(level[i][j]-1);
								
								if(level[i][j]==10) {
									//number.mouseDrag = onMouseDrag;
									number.enableDrag();
								}
								mapContainer.addChild(number);
							}
							
						}
					}
					*/
				 }
			}
	);
	CAAT.loop(30);
}

function placeNumber(me) {
	var ax = Math.floor(me.x / numberImages.singleWidth);
	var ay = Math.floor(me.y / numberImages.singleHeight);

	if (calarrays[ax][ay]!=0) return;
	
	var number = numbers.shift();
	var actor = numberActors.shift();
	
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
	
	numbers.push((Math.floor(Math.random()*9)+1) + "-" + (Math.floor(Math.random()*9) + 1));
	_pushInNumber();
	
	calarrays[ax][ay] = number;
	actorsPlaced[ax][ay] = actor;
	
	placeRandomNumber();
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
	
	var scaling= new CAAT.ScaleBehavior().
    setFrameTime(actor.time, 800).
    setValues( .5, 1, .2, 1, .5, .5);
	
	actor.emptyBehaviorList();
	actor.addBehavior(scaling);
	
	squareContainer.addChild(actor);
	calarrays[ax][ay] = vx + "-" + vy;
	actorsPlaced[ax][ay] = actor;
}


function checkAndRemove(x,y) {
	var removed = false;
	//6  list for x 
	var xa = getPosNumber(x-2, y);
	var xb = getPosNumber(x-1, y);
	var xc = getPosNumber(x, y);
	var xd = getPosNumber(x+1, y);
	var xe = getPosNumber(x+2, y);
	
	if (xa>0 && xb>0 && xc>0 && xd>0 && xe>0 && (xb-xa==xc-xb && xc-xb==xd-xc && xd-xc==xe-xd) && (Math.abs(xb-xa)==1 || xb==xa)) {
		removeBlock(x-2,y);
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		removeBlock(x+2,y);
		removed = true;
	} else if (xa>0 && xb>0 && xc>0 && xd>0 && (xb-xa==xc-xb && xc-xb==xd-xc) && (xb==xa || Math.abs(xb-xa)==1)) {
		removeBlock(x-2,y);
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		removed = true;
	} else if (xb>0 && xc>0 && xd>0 && xe>0 && (xc-xb==xd-xc && xd-xc==xe-xd) && (xc==xb || Math.abs(xc-xb)==1)) {
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		removeBlock(x+2,y);
		removed = true;
	} else if (xb>0 && xc>0 && xd>0 && (xc-xb==xd-xc) && (xc==xb || Math.abs(xc-xb)==1)) {
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		removed = true;
	} else if (xd>0 && xc>0 && xe>0 && (xd-xc==xe-xd) && (xd==xc || Math.abs(xd-xc)==1) ) {
		removeBlock(x+1,y);
		removeBlock(x+2,y);
		removed = true;
	} else if (xa>0 && xb>0 && xc>0 && (xb-xa==xc-xb) && (xb==xa || Math.abs(xb-xa)==1)) {
		removeBlock(x-2,y);
		removeBlock(x-1,y);
		removed = true;
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
		removed = true;
	} else if (ya>0&&yb>0&&yc>0&&yd>0 && (yb-ya==yc-yb && yc-yb==yd-yc) && (Math.abs(yb-ya)==1 || ya==yb)) {
		removeBlock(x,y-2);
		removeBlock(x,y-1);
		removeBlock(x,y+1);
		removed = true;
	} else if (yb>0&&yc>0&&yd>0&&ye>0 && (yc-yb==yd-yc && yd-yc==ye-yd) && (Math.abs(yc-yb)==1 || yc==yb)) {
		removeBlock(x,y-1);
		removeBlock(x,y+1);
		removeBlock(x,y+2);
		removed = true;
	} else if (ya>0&&yb>0&&yc>0 && (yb-ya==yc-yb) && (Math.abs(yb-ya)==1 || ya==yb)) {
		removeBlock(x,y-2);
		removeBlock(x,y-1);
		removed = true;
	} else if (yb>0&&yc>0&&yd>0 && (yc-yb==yd-yc) && (Math.abs(yc-yb)==1 || yc==yb)) {
		removeBlock(x,y-1);
		removeBlock(x,y+1);
		removed = true;
	} else if (yc>0&&yd>0&&ye>0 && (yd-yc==ye-yd) && (Math.abs(yd-yc)==1 || yd==yc)) {
		removeBlock(x,y+1);
		removeBlock(x,y+2);
		removed = true;
	}

	if (removed==true) {
		removeBlock(x,y);
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
		
		actor= new CAAT.Actor()
		.setBackgroundImage(numberImages.getRef(),true)
		.setSpriteIndex((parseInt(vs[0])-1)*9 + parseInt(vs[1])-1);
		
		var path= new CAAT.LinearPath()
	    	.setInitialPosition(width, -40)
	    	.setFinalPosition(200 + pos*(numberImages.singleWidth), -40);

		var pb = new CAAT.PathBehavior()
          .setPath(path)
          .setFrameTime(actor.time, 500)
          .setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator());
		actor.addBehavior(pb);

		squareContainer.addChild(actor);
	} else {
		var path= new CAAT.LinearPath()
	    .setInitialPosition(actor.x,-40)
	    .setFinalPosition(200 + pos*(numberImages.singleWidth), -40);
		var pb = new CAAT.PathBehavior()
        .setPath(path)
        .setFrameTime(actor.time, 500)
        .setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator());
		actor.addBehavior(pb);
	}
	return actor;
}


function onMouseDrag(me) {
	//console.log(me.x + "  " + me.y);
	me.source.setPosition(me.source.x + me.x, me.source.y + me.y);
	
}


