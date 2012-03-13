
var director;
var mapScene;
var mapContainer;

var numbers = ['1-1','4-2','5-3','3-4','3-5'];

var calarrays = [
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0]
];

var actorsPlaced =
[
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0]
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
		            
		            
		            mapContainer.mouseDown = placeNumber;
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
	var number = numbers.shift();
	var actor = numberActors.shift();
	
	var ax = Math.floor(me.x / numberImages.singleWidth);
	var ay = Math.floor(me.y / numberImages.singleHeight);
	
	var path= new CAAT.LinearPath()
	.setInitialPosition(actor.x, actor.y)
	.setFinalPosition(ax * numberImages.singleWidth , ay * numberImages.singleHeight);

	var pb = new CAAT.PathBehavior()
	  .setPath(path)
	  .setFrameTime(actor.time, 500)
	  .setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator());
	actor.addBehavior(pb);
	
	numbers.push((Math.floor(Math.random()*9)+1) + "-" + (Math.floor(Math.random()*9) + 1));
	_pushInNumber();
	
	calarrays[ax][ay] = number;
	actorsPlaced[ax][ay] = actor;
}


function checkAndRemove(x,y) {

	var removed = false;
	var links = [];
	links.push(calarrays[0][y]);
	
	var prev = 2;
	
	for ( var i = 0; i < calarrays.length-1; i++) {
		var diff = getPosNumber(i+1,y) - getPosNumber(i,y);
		var abs = Math.abs(diff);
		if (abs==0 || abs==1) {
			if (diff!=prev) {
				if (links.length==2) {
					links.shift();
					prev = diff;
					links.push(getPosNumber(i+1,y));
				} else if (links.length>=3) {
					if (i>=x && i-links.length<=x) {
						break;
					} else {
						links = [];
					}
				} else {
					links.push(getPosNumber(i+1,y));
				}
			} else {
				links.push(getPosNumber(i+1,y));
			}
		} else {
			links.pop();
			links.push(calarrays[i][y]);
		}
	}
	alert(links);
}


function getPosNumber(x, y) {
	if (x<0 || x>=calarrays.length) {
		return  -1;
	}
	
	if (y<0 || y>=calarrays[0].length) {
		return -1;
	}
	
	if (calarrays[x][y]==0) {
		return -1;
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
	    	.setInitialPosition(width,70)
	    	.setFinalPosition(200 + pos*(numberImages.singleWidth), 70);

		var pb = new CAAT.PathBehavior()
          .setPath(path)
          .setFrameTime(actor.time, 500)
          .setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator());
		actor.addBehavior(pb);

		mapContainer.addChild(actor);
	} else {
		var path= new CAAT.LinearPath()
	    .setInitialPosition(actor.x,70)
	    .setFinalPosition(200 + pos*(numberImages.singleWidth), 70);
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


