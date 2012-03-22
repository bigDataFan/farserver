
var director;
var mapScene;
var startScene;
var mapContainer;
var squareContainer;
var ready = false; 

var placed = 0;
var levelInfo;
var numbers = [];

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

var actorsPlaced = [
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


var gamectx = {};

function initGameCtx(leveled) {
	calarrays = [
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0]
	];

	actorsPlaced =
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

	placed = 0;
	if (leveled) {
		gamectx.level = 0;
		goNextLevel();
	} else {
		gamectx.level = 100;
		goNextLevel();
		gamectx.remains = Number.MAX_VALUE;
	}
}

function goNextLevel() {
	gamectx.level ++;
	levelInfo.setText(gamectx.level + "级");
	gamectx.remains = getLevelBlocks(gamectx.level);
	
	for ( var i = 0; i < 6; i++) {
		putInQueue();
	}
	_pushInNumber();
}

function boot() {
	director = new CAAT.Director().initialize(
	        width, height,
	        document.getElementById('container'));
	startScene = director.createScene();
	mapScene = director.createScene();
	new CAAT.ImagePreloader().loadImages(
			worknfightImages,
			function(counter, images) {
				 if (counter==worknfightImages.length) {
					director.setImagesCache(images);
					initStartScene();
					//director.setScene(director.getSceneIndex(mapScene));
				 }
			}
	);
	CAAT.loop(30);
}

/**
 * 初始化开始屏幕。 主要是几个操作按钮
 */
function initStartScene() {
	var startContainer = new CAAT.ActorContainer().
	setBounds(0, 0, director.width, director.height);
	startScene.addChild(startContainer);
	
	var bgimage= new CAAT.SpriteImage().
	initialize(director.getImage('background'), 1, 1);
	
	startContainer.setBackgroundImage(bgimage.getRef(), true).setBackgroundImageOffset(-300,-1200);
	
	var btnStartLevelImg = new CAAT.SpriteImage().
	initialize(director.getImage('btnstartLevel'), 1, 1);
	
	var btnEmptyImg = new CAAT.SpriteImage().
	initialize(director.getImage('btnEmpty'), 1, 1);
	var b1= new CAAT.Actor()
		.setAsButton(
					btnStartLevelImg.getRef(), 0, 0, 0, 0, onGameStartClicked
	     ).setLocation(width/2-80,height/2-60);
	startContainer.addChild(b1);
	
	var b2= new CAAT.Actor()
		.setAsButton(btnEmptyImg.getRef(), 0, 0, 0, 0, onCrazyStartClicked
			).setLocation(width/2-80, height/2+60);
	startContainer.addChild(b2);
}

function onGameStartClicked(button) {
	initLevelsScene();
	initGameCtx(true);
	director.setScene(director.getSceneIndex(mapScene));
}

function onCrazyStartClicked(button) {
	initLevelsScene();
	director.setScene(director.getSceneIndex(mapScene));
}


/**
 * 初始化游戏屏幕
 */
function initLevelsScene() {
	
	mapContainer = new CAAT.ActorContainer().
	setBounds(0, 0, director.width, director.height);
	mapScene.addChild(mapContainer);

	squareContainer = new CAAT.ActorContainer().
	setBounds(0, director.height-400, 320, 400);
	mapScene.addChild(squareContainer);

	/*
	var progressbg = new CAAT.Actor()
   	.setBounds(100, -50, 500, 50)
   	.setFillStyle('#fff').setAlpha(0.2);
	squareContainer.addChild(progressbg);
	*/
	numberImages= new CAAT.SpriteImage().
	initialize(director.getImage('numbers'), 9, 9);
	extraImages =  new CAAT.SpriteImage().
	initialize(director.getImage('extras'), 1, 9);
	var chessbgImages =  new CAAT.SpriteImage().
	initialize(director.getImage('chessbg'), 1, 1);
	var bgimage= new CAAT.SpriteImage().
	initialize(director.getImage('background'), 1, 1);
	
	mapContainer.setBackgroundImage(bgimage.getRef(), true).setBackgroundImageOffset(-200,-1000);
	squareContainer.setBackgroundImage(chessbgImages.getRef(), true).setBackgroundImageOffset(0,0);
	
	flyNearCloud('cloudfar', 2, mapContainer);
	flyNearCloud('cloudnear', 1, mapContainer);
	
	
	var animalsImg= new CAAT.SpriteImage().
	initialize(director.getImage('animals'), 1, 1);
	
	var animals= new CAAT.Actor().
	setBackgroundImage(animalsImg.getRef(), true).
	setLocation(55, 50);
	mapContainer.addChild(animals);
	
	levelInfo = new CAAT.TextActor().
	setFont("20px sans-serif").
	setText("1级").
	setOutlineColor('white').
	calcTextSize(director).
	setTextAlign("center").
	setLocation(10, 70).
	setOutline(true);
	mapContainer.addChild(levelInfo);

	/*
	var levelImage = new CAAT.SpriteImage().
		initialize(director.getImage('levelbg'), 1, 1);
	var levelContainer = new CAAT.ActorContainer()
		.setBackgroundImage(levelImage.getRef(), true)
		.setBounds(5, 5, levelImage.singleWidth, levelImage.singleHeight);
	mapScene.addChild(levelContainer);
	*/
	
	squareContainer.mouseDown = onBoadClicked;
	initScore();
}


/**为背景增加一个浮动的云彩 第二个参数为速度 */
function flyNearCloud(image, speed, container) {
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
      	  	flyNearCloud(image, speed, container);
        }
    } );
	cloudNearActor.addBehavior(pb);
	container.addChild(cloudNearActor);
}



/**设置当前的分数*/
var scoreActors = [];
var score = 0;

/**初始化分数栏*/
function initScore() {
	var scoreImage = new CAAT.SpriteImage().
	initialize(director.getImage('scorebg'), 1, 1);
	var scoreContainer = new CAAT.ActorContainer()
	.setBackgroundImage(scoreImage.getRef(), true)
	.setBounds(director.width - scoreImage.singleWidth, 0, scoreImage.singleWidth, scoreImage.singleHeight);
	mapScene.addChild(scoreContainer);
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
}

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


/**处理一个棋子移动*/
var moving = null;
function doMoving(me) {
	if (moving) {
		var ax = Math.floor(me.x / numberImages.singleWidth);
		var ay = Math.floor(me.y / numberImages.singleHeight);

		actorsPlaced[ax][ay] = moving.actor;
		calarrays[ax][ay] = moving.value;
		
		calarrays[moving.posx][moving.posy] = 0;
		actorsPlaced[moving.posx][moving.posy] = null;
		
		var path= new CAAT.LinearPath()
		.setInitialPosition(moving.actor.x, moving.actor.y)
		.setFinalPosition(ax * numberImages.singleWidth , ay * numberImages.singleHeight);

		var pb = new CAAT.PathBehavior()
		  .setPath(path)
		  .setFrameTime(moving.actor.time, 300)
		  .addListener( {
	          behaviorExpired : function(behavior, time, actor) {
	        	  actor.setScale(1,1);
	        	  checkAndRemove(ax,ay);
	          }
	      });
		moving.actor.addBehavior(pb);
		moving = null;
	}
}


/**用于移动处理 当鼠标点击方块时选择移动的源*/
function actorMouseDown(me) {
	var info = numbers[0].split("-");
	var type = info[0];
	var n = info[1]
	if (type=="a") {
		var ax = Math.floor((me.screenPoint.x-squareContainer.x) / numberImages.singleWidth);
		var ay = Math.floor((me.screenPoint.y-squareContainer.y) / numberImages.singleHeight);
		
		if (n=="1") {
			moving = {
					actor: me.source,
					posx: ax,
					posy: ay,
					value: calarrays[ax][ay]
			};
			var number = numbers.shift();
			var actor = numberActors.shift();
			
			actor.setExpired(0);
			actorsPlaced[ax][ay].setScale(.8, .8);
			generateNextBlock();
		}
		
		if (n=="2") {
			var number = numbers.shift();
			var actor = numberActors.shift();
			actor.setExpired(0);
			
			removeBlock(ax, ay, "zoomout");
			generateNextBlock();
		}
	}
}


/**道具被放置到棋盘后的效果处理*/
function doExtras(number, actor, x, y) {
	
	var extraNumber = number.split("-")[1];
	
	if (extraNumber=="1") {  //移动到目的地的处理事件  放弃操作
		calarrays[x][y] = 0;
		actorsPlaced[x][y] = null;
		actor.setExpired(0);
		placed --;
		return;
	}
	
	if (extraNumber=="2") {  //抠掉一个方块。  放弃
		calarrays[x][y] = 0;
		actorsPlaced[x][y] = null;
		actor.setExpired(0);
		placed --;
		return;
	}
	
	if (extraNumber=="3") {
		
	}
	
	if (extraNumber=="4") { //炸掉四周的方块
		removeBlock(x,y, "burst");
		removeBlock(x-1,y, "burst");
		removeBlock(x+1,y, "burst");
		removeBlock(x,y-1, "burst");
		removeBlock(x,y+1, "burst");
	}
}

/** 棋盘的点击事件 */
function onBoadClicked(me) {
	if (moving!=null) {
		doMoving(me);
		return;
	}
	
	if (!ready) return;
	
	var ax = Math.floor(me.x / numberImages.singleWidth);
	var ay = Math.floor(me.y / numberImages.singleHeight);
	if (calarrays[ax][ay]!=0) return;
	
	var number = numbers.shift();
	var actor  = numberActors.shift();
	calarrays[ax][ay] = number;
	actorsPlaced[ax][ay] = actor;
	placed ++;
	
	var path= new CAAT.LinearPath()
	.setInitialPosition(actor.x, actor.y)
	.setFinalPosition(ax * numberImages.singleWidth , ay * numberImages.singleHeight);
	ready = false;
	var pb = new CAAT.PathBehavior()
	  .setPath(path)
	  .setFrameTime(mapScene.time, 300)
	  //.setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator())
	  .addListener( {
          behaviorExpired : function() {
        	  if (number.split("-")[0]=="a") {
        		  doExtras(number, actor, ax, ay);
        	  } else {
        		  checkAndRemove(ax, ay);
        	  }
        	  if (numbers.length==0) {
        		  goNextLevel();
        	  } else {
        		  generateNextBlock();
        	  }
          }
      } );
	actor.addBehavior(pb);
	
}

/**根据等级等信息 随机生成下一个方块*/
function generateNextBlock() {
	gamectx.remains --;
	
	if (Math.random() < getLevelRand(gamectx.level)) {
		var n = getLevelNumber(gamectx.level);
		for ( var i = 0; i < n; i++) {
			placeRandomNumber();
		}
	}
	
	if (gamectx.remains<=6) {
		
	} else {
		putInQueue();
	}
	
	_pushInNumber();
}

function putInQueue() {
	
	if (Math.random()<0.1) {
		pp  = gamectx.level;
		if (pp>4) pp=4;
		numbers.push("a-" + (Math.floor(Math.random()*pp) + 1));
	} else {
		numbers.push((Math.floor(Math.random()*9)+1) + "-" + (Math.floor(Math.random()*9) + 1));
	}
} 

/**随机在棋盘上放置一个数字方块*/
function placeRandomNumber() {
	if (80 - placed < 10) return;
	
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
	placed ++;
	
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
	
	actor.mouseDown = actorMouseDown;
	squareContainer.addChild(actor);
}

/**核心：检查方块是否能够消除*/
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
	
	if (placed>=80) {
		alert("失败 ");
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

/**删除指定位置的方块,可以指定多种效果 包括淡出、旋转退出， 掉落等*/
function removeBlock(x, y, effect) {
	if (x>=0 && x<calarrays.length && y>=0 && y<calarrays[0].length) {
		var actor = actorsPlaced[x][y];
		if (calarrays[x][y]!=0) {
			calarrays[x][y] = 0;
        	actorsPlaced[x][y] = null;
        	placed --;
        	
        	if (effect=="zoomout") {
        		var zoomout= new CAAT.ScaleBehavior().
                  setFrameTime(actor.time, 500).
                  setValues( 1, .1, 1, .1, .5, .5).
                  addListener( {
                      behaviorExpired : function(behavior, time, actor) {
                    	  actor.setExpired(0);
                      }
                  });
        		actor.addBehavior(zoomout);
        		
        	} else if (effect=="burst") {
        		var rz = Math.random() * 10 -5; 
        		var throwBehavior = new CAAT.PathBehavior().
                 	setFrameTime( actor.time, 800).
                 	setPath(
                         new CAAT.Path().
                                 beginPath( actor.x, actor.y).
                                 addQuadricTo( actor.x + rz * 20, actor.y-100, actor.x+ rz*50, actor.y+500).
                                 endPath()
                 	).
                 	addListener( {
                         behaviorExpired : function(behavior, time, actor) {
                             actor.setExpired(0);
                         }
                 	});
        		 actor.addBehavior(throwBehavior);
        	} else {
        		var rotating= new CAAT.RotateBehavior().
        		setCycle(false).
        		setFrameTime(actor.time, 500).
        		setValues(0, 2*Math.PI, 0.5, 0.5).
        		addListener( {
        			behaviorExpired : function() {
        				actor.setExpired(0);
        			}
        		} );
        		actor.addBehavior(rotating);
        	}
		}
	}
}

/**为候选的一个位置增加一个方块，并将其飞行到指定位置*/
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
		if (value==null) return;
		
		var vs = value.split("-");
		
		if (vs[0]=='a') {
				//move 
			actor= new CAAT.Actor()
			.setBackgroundImage(extraImages.getRef(),true)
			.setSpriteIndex(parseInt(vs[1])-1)
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
		.setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator())
		.addListener( {
                         behaviorExpired : function(behavior, time, actor) {
                        	 if (numberActors[numberActors.length-1]==actor) {
                        		 ready = true;
                        	 }
                         }
                 	});
		
		actor.addBehavior(pb);
		actor.setPosition(110 + pos*(numberImages.singleWidth), -45);
		squareContainer.addChild(actor);
		actor.mouseDown = actorMouseDown;
	} else {
		var path= new CAAT.LinearPath()
	    .setInitialPosition(actor.x,-45)
	    .setFinalPosition(110 + pos*(numberImages.singleWidth), -45);
		var pb = new CAAT.PathBehavior()
        .setPath(path)
        .setFrameTime(squareContainer.time, 500)
        .setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator())
		.addListener( {
            behaviorExpired : function(behavior, time, actor) {
           	 if (numberActors[numberActors.length-1]==actor) {
           		 ready = true;
           	 }
            }
    	});

		actor.addBehavior(pb);
		
		actor.setPosition(110 + pos*(numberImages.singleWidth), -45);
	}
	return actor;
}

