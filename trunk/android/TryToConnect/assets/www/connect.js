/**
 * 
 */

var ary = wrapArray(generateFromTemplate(generateRandomArray(10,10), 10));

var director;
var scene;
var gamecontainer;
var splashScene;
var nextLevelScene;
var failScene;
var btnImage;

var superClickInfo;
var scoreInfo;
var levelInfo;
var lifeProgressActor;


var level = 1;


var score = 0;
var total_remains = 0;

function start() {
	director = new CAAT.Director().initialize(
	        width, height,
	        document.getElementById('_c1'));
	
   loadSplashScene();
   CAAT.loop(60);
}

function loadSplashScene() {
	splashScene = director.createScene();
	var acontainer = new CAAT.ActorContainer().
		setBounds(0, 0, director.width, director.height);
	
	splashScene.addChild(acontainer);
	
	acontainer.addBehavior(
			new CAAT.PathBehavior()
		 	.setFrameTime(splashScene.time, 1000 )
		 	.setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator())
		 	.setValues(
		 			new CAAT.Path().setLinear(
		 					0,
		 					-200,
		 					0,
		 					0)
		 			 )
	);
	
	new CAAT.ImagePreloader().loadImages(
			resImages,
			function(counter, images) {
				 if (counter==4) {
					 director.setImagesCache(images);
					 // an image of 7 rows by 3 columns
					 btnImage= new CAAT.SpriteImage().initialize(
							 director.getImage('buttons'), 7, 3 );
					 
					 var splashImage = new CAAT.SpriteImage().initialize(director.getImage('splash'), 1,1);
					 
					 var splashActor = new CAAT.Actor().setBackgroundImage(splashImage.getRef(), true);
					 
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
					
					 var b1= new CAAT.Actor()
					 			.setAsButton(
							                 btnImage.getRef(), 6, 7, 8, 6, function(button) {
												 director.setScene(director.getSceneIndex(scene));
												 startGame();
							                 }
							     ).setLocation(width/2-80,height/2-80);
					 acontainer.addChild(b1);
			 
					 initGameScene();
					 initFailScene();
					 initNextLevelScene();
				 }
			}
	);
}


function initFailScene() {
	failScene = director.createScene();
	var acontainer = new CAAT.ActorContainer().
	setBounds(0, 0, director.width, director.height);

	failScene.addChild(acontainer);
	
	var failImage = new CAAT.SpriteImage().initialize(director.getImage('failed'), 1,1);
	var failActor = new CAAT.Actor()
		.setBackgroundImage(failImage.getRef(), true)
		.setLocation(director.width/2 - 100,100);
	
	acontainer.addChild(failActor);
	
	
	 var b1= new CAAT.Actor()
		.setAsButton(
                 btnImage.getRef(), 15, 16, 17, 15, function(button) {
	 				director.setScene(director.getSceneIndex(splashScene));
                 }
	     ).setLocation(width/2-80, 200);
	 acontainer.addChild(b1);
	 
	 var b2= new CAAT.Actor()
		.setAsButton(
                 btnImage.getRef(), 12, 13, 14, 12, function(button) {
					 director.setScene(director.getSceneIndex(scene));
					 startGame();
                 }
	     ).setLocation(width/2-80, 250);
	 acontainer.addChild(b2);
}



function initNextLevelScene() {
	nextLevelScene = director.createScene();
	var acontainer = new CAAT.ActorContainer().
	setBounds(0, 0, director.width, director.height);
	
	nextLevelScene.addChild(acontainer);
	
	var nextImage = new CAAT.SpriteImage().initialize(director.getImage('nextlevel'), 1,1);
	var nextLevelActor = new CAAT.Actor()
		.setBackgroundImage(nextImage.getRef(), true)
		.setLocation(director.width/2 - 100,80);
	
	acontainer.addChild(nextLevelActor);
	
	
	 var b1= new CAAT.Actor()
		.setAsButton(
                btnImage.getRef(), 6, 7, 8, 6, function(button) {
					director.setScene(director.getSceneIndex(scene));
					goNextLevel();
                }
	     ).setLocation(width/2-80, 200);
	 acontainer.addChild(b1);
	 
	 var b2= new CAAT.Actor()
		.setAsButton(
                btnImage.getRef(), 12, 13, 14, 12, function(button) {
					director.setScene(director.getSceneIndex(splashScene));
	            }
	     ).setLocation(width/2-80, 250);
	 acontainer.addChild(b2);
}

function showNextLevelScreen() {
	director.setScene(director.getSceneIndex(nextLevelScene));
}

function pauseGame() {
	
}

function resumeGame() {
	
}

function resetAll() {
	lastClicked = 0;
	clicked = 0;
	time_remains = 10000;
	superClickInfo.setText("");
	scoreInfo.setText("");
	levelInfo.setText("lev:" + level);
	score = 0;
}

function goNextLevel() {
	level ++;
	startGame();
}

function startGame() {
	resetAll();
	
	var diff = 10 + Math.floor(level/4);
	if (diff>15) diff=15;
	
	ary = wrapArray(generateFromTemplate(generateRandomArray(10,10), diff));
	initBlocks(ary);
	
	lifeTimer = scene.createTimer(
			 0,
             500,
             function(scene_time, timer_time, timertask_instance)  {   // timeout
				 if (time_remains<=0) {
					 //fail
					 director.setScene(director.getSceneIndex(failScene));
					 resetAll();
				 } else {
					 time_remains -= 50 * level;
					 lifeProgressActor.setBounds(5, 5, bar_width*time_remains/10000,bar_height);
					 timertask_instance.reset(scene_time);
				 }
             },
             function(scene_time, timer_time, timertask_instance)  {   // tick
             },
             function(scene_time, timer_time, timertask_instance)  {   // cancel
             }
     );
}

function initGameScene() {
	
	scene= director.createScene();
	
	//loadSplashScene();
	
	var infoContainer = new CAAT.ActorContainer().
		setBounds(0, 0, director.width, life_height);
	
	scene.addChild(infoContainer);

	scoreInfo = new CAAT.TextActor().
    	setFont("20px sans-serif").
    	setText("").
    	setOutlineColor('white').
    	calcTextSize(director).
    	setTextAlign("center").
    	//setTextFillStyle(gradient).
    	setLocation((infoContainer.width-50),5).
    	setOutline(true);
    	//.cacheAsBitmap();
   infoContainer.addChild(scoreInfo);
   
   levelInfo = new CAAT.TextActor().setFont("20px sans-serif").
	   	setText("").
		setOutlineColor('white').
		calcTextSize(director).
		setTextAlign("center").
		//setTextFillStyle(gradient).
		setLocation((infoContainer.width-140),5).
		setOutline(true);
   infoContainer.addChild(levelInfo);
   
   var progressbg = new CAAT.Actor()
   	.setBounds(5, 5, bar_width,bar_height)
   	.setFillStyle('#fff').setAlpha(0.5);
	infoContainer.addChild(progressbg);
	
	lifeProgressActor = new CAAT.Actor()
	.setBounds(5, 5, bar_width,bar_height)
	.setFillStyle('#ccc');
	infoContainer.addChild(lifeProgressActor);
	
	
	var scoreContainer = new CAAT.ActorContainer().
		setBounds(0, life_height + director.width, director.width, life_height);

	superClickInfo = new CAAT.TextActor().
		   setFont("24px sans-serif").
			setText("分数").
			setOutlineColor('white').
			calcTextSize(director).
			setTextAlign("center").
			//setTextFillStyle(gradient).
			setLocation(10,10).
			setOutline(true);
	scoreContainer.addChild(superClickInfo);
	scene.addChild(scoreContainer);
	
	/*
	var b1= new CAAT.Actor()
		.setAsButton(
                btnImage.getRef(), 15, 16, 17, 15, function(button) {
	 				director.setScene(director.getSceneIndex(splashScene));
                }
	     ).setLocation(width-180, 10);
	scoreContainer.addChild(b1);
*/
	new CAAT.ImagePreloader().loadImages(
				 imageRes,
				function(counter, images) {
					director.setImagesCache(images);
					//initBlocks();
				}
		);
}

function initBlocks(ary) {
	total_remains = 0;
	var blockImages = new CAAT.SpriteImage().initialize(director.getImage('blocks'), 1,16);

	if (gamecontainer!=null) {
		scene.removeChild(gamecontainer);
	}
	gamecontainer = new CAAT.ActorContainer().
	setBounds(0, life_height, director.width, director.width);
	//.setFillStyle('#fff')
	//.setAlpha(0.5);
	scene.addChild(gamecontainer);
	
	for(var i=0; i<ary.length; i++) {
		for(var j=0; j<ary[i].length; j++) {
			if (ary[i][j]=='') continue;
			
			var actorStar = new CAAT.Actor().setBackgroundImage(blockImages.getRef(), true).setSpriteIndex(parseInt(ary[i][j]));
			var pathBehavior = new CAAT.PathBehavior()
			 	.setFrameTime(actorStar.time, Math.random()*2000 )
			 	.setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator())
			 	.setValues(
			 			new CAAT.Path()
			 			.setLinear(
                            //Math.random()<.5 ? scene.width+Math.random() * 50 : -50-Math.random()*scene.width,
                            (i-1)*icon_width,
                            Math.random()<.5 ? scene.width+Math.random() * icon_width : -icon_width-Math.random()*scene.height,
                            (i-1)*icon_width,
                            (j-1)*icon_width
                        ));
			//.setBounds(i*50, j*50 , 48,48)
			actorStar.addBehavior(pathBehavior);
			gamecontainer.addChild(actorStar);
			total_remains ++;
			actorStar.mouseDown = spriteMouseDown;
		}
	}
}


var src = null;
var srcActor = null;

function spriteMouseDown(me) {
	if (src==null) {
		src = {x: me.source.x/icon_width+1, y:me.source.y/icon_width+1};
		me.source.setAlpha(0.6);
		srcActor = me.source; 
	} else {
		var target = {x: me.source.x/icon_width+1, y:me.source.y/icon_width+1};
		if (matchTarget(src, target, ary)) {
			
			var _scene_4_rotating_behavior= new CAAT.RotateBehavior().
            setCycle(false).
            //setFrameTime( 0, 2000 ).
            setValues(0, 2*Math.PI, 0, 0);
			srcActor.emptyBehaviorList();
			srcActor.addBehavior(
					new CAAT.ScaleBehavior().
                    setFrameTime( srcActor.time, 300).
                    setValues( 1, 2, 1, 2 ).
                    setPingPong().addListener( {
                        behaviorExpired : function(behavior, time, actor) {
                            actor.setExpired(true);
                        }
                	})
            );
			
			me.source.addBehavior(
					new CAAT.ScaleBehavior().
                    setFrameTime( me.source.time, 300).
                    setValues( 1, 2, 1, 2 ).
                    //setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator()).
                    setPingPong().addListener( {
                        behaviorExpired : function(behavior, time, actor) {
                            actor.setExpired(true);
                        }
                	})
            );
			
			var ddclick = getClicked(5000);
			
			score += 10 + ddclick * 5;
			scoreInfo.setText(score);
			
			showClicked(ddclick);
			
			total_remains -=2;
			
			if (total_remains<=0) {
				showNextLevelScreen();
			}
			
             //.setDiscardable(true).setExpired(1000);
			//srcActor.setDiscardable(true).setExpired(0);
			//me.source.setDiscardable(true).setExpired(0);
		} else {
			srcActor.setAlpha(1);
		}
		srcActor = null;
		src = null;
	}
	//alert("x=" + me.source.x/50 + "  y=" + me.source.y/50);
	
	
	//me.source.setDiscardable(true)
	//.setExpired(0);
	/*
	me.source.addBehavior(rotateLeft);
	if (clicked.contains(me.source)) {
	
	} else {
		clicked.push(me.source);
	}
	*/
}

var lastClicked = 0;
var clicked = 0;
function getClicked(mill) {
	var currentTime = new Date().getTime();
	if (currentTime - lastClicked < mill) {
		clicked ++;
	} else {
		clicked = 0;
	}
	lastClicked = currentTime;
	
	return clicked;
}

function showClicked(n) {
	if (n!=0) {
		superClickInfo.setText(n + "连击!");
		superClickInfo.emptyBehaviorList();
		superClickInfo.addBehavior(
				new CAAT.ScaleBehavior().
                setFrameTime( superClickInfo.time, 300).
                setValues( 1, 2, 1, 2 ).
                setPingPong()
        );
	} else {
		superClickInfo.setText("");
	}
}




function generateRandomArray(w, h) {
	var array = [];
	
	for ( var i = 0; i < w; i++) {
		var cc = [];
		for ( var j = 0; j < h; j++) {
			cc.push(String(Math.floor(Math.random()*10) + 1));
		}
		array.push(cc);
	}
	return array;
}

function generateFromTemplate(template, c) {
	
	var total = 0;
	for ( var i = 0; i < template.length; i++) {
		for ( var j = 0; j < template[i].length; j++) {
			if (template[i][j]!='') {
				total ++;
			}
		}
	}
	
	var array = [];
	
	for ( var i = 0; i < total/2; i++) {
		var fl = Math.floor(Math.random()*c);
		array.push(fl);
		array.push(fl);
	}
	
	for ( var i = 0; i < total; i++) {
		var a = Math.floor(Math.random()*total);
		var b = Math.floor(Math.random()*total);
		var t = array[a];
		array[a] = array[b];
		array[b] = t;
	}
	
	for ( var i = 0; i < template.length; i++) {
		for ( var j = 0; j < template[i].length; j++) {
			if (template[i][j]!='') {
				template[i][j] = String(array.pop());
			}
		}
	}
	return template;
}

function wrapArray(array) {
	var new_array = [];
	
	var ob = [];
	for ( var i = 0; i < array[0].length+2; i++) {
		ob.push('');
	}
	new_array.push(ob);
	
	for ( var i = 0; i < array.length; i++) {
		var cc = [];
		cc.push('');
		for ( var j = 0; j < array[i].length; j++) {
			cc.push(array[i][j]);
		}
		cc.push('');
		new_array.push(cc);
	}
	new_array.push(ob);
	return new_array;
}


function matchTarget(source, target, array) {
	var temp_a = array[source.x][source.y];
	var temp_b = array[target.x][target.y];

	
	if (temp_a!=temp_b) return false;
	
	array[source.x][source.y] = '';
	array[target.x][target.y] = '';
	
	vc =  checkVerticals(source, target, array);
	if (vc!=false) {
		return vc;
	}
	
	hc = checkHorizontals(source,target, array);
	
	if (hc!=false) {
		return hc;
	}
	array[source.x][source.y] = temp_a;
	array[target.x][target.y] = temp_b;
	
	return false;
}

function checkVerticals(source, target, array) {
	if (source.x==target.x) return false;
	
	for ( var i = 0; i < array[0].length; i++) {
		if (checkConnective({x:source.x, y:i}, source, array) 
				&& checkConnective({x:target.x, y:i}, target, array)
				&& checkConnective({x:source.x, y:i}, {x:target.x, y:i}, array)) {
			return {a:{x:source.x, y:i}, b:{x:target.x, y:i}};
		}
	}
	return false;
}

function checkHorizontals(source, target, array) {
	
	if (source.y==target.y) return false;
	
	for ( var i = 0; i < array.length; i++) {
		if (checkConnective({x:i, y:source.y}, source, array) 
				&& checkConnective({x:i, y:target.y}, target, array)
				&& checkConnective({x:i, y:target.y}, {x:i, y:source.y}, array)) {
			return {a:{x:i,y:target.y}, b:{x:i,y:source.y}};
		}
	}
	return false;
}


function checkConnective(source, target, array) {
	if (source.x==target.x) {
		if (source.y==target.y) return true;
		
		var from = source.y;
		var to = target.y;
		if (from>to) {
			var temp = to;
			to = from;
			from = temp;
		}
		
		for ( var i = from; i<=to ; i++) {
			if (array[source.x][i]!='') {
				return false;
			}
		}
		return true;
	}
	
	if (source.y==target.y) {
		var from = source.x;
		var to = target.x;
		if (from>to) {
			var temp = to;
			to = from;
			from = temp;
		}
		
		for ( var i = from; i<=to ; i++) {
			if (array[i][source.y]!='') {
				return false;
			}
		}
		return true;
	}
}

var rotateLeft= new CAAT.RotateBehavior().
	//setCycle(true).
	setPingPong().
	setFrameTime( 0, 1000 ).
	setValues(0, 0.03*Math.PI, 1,1);


