
var director;
var mapScene;
var startScene;
var mapContainer;
var squareContainer;
var ready = false; 
var isPendding = false;
var placed = 0;
var levelInfo;
var numbers = [];


var isPhone = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);

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
var txtinfoImages = null;

var MODEL_RIDDLE = 0;
var MODEL_LEVEL = 1

var gamectx = {};

var gameModel;

function initRiddle(t) {
	
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

	for ( var i = 0; i < actorsPlaced.length; i++) {
		for ( var j = 0; j < actorsPlaced[i].length; j++) {
			if (actorsPlaced[i][j]!=0 && actorsPlaced[i][j]!=null) {
				actorsPlaced[i][j].setExpired(0);
			}
		}
	}
	
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
	gameModel = MODEL_RIDDLE;
	calarrays = riddles[t].clone();
	
	for ( var i = 0; i < calarrays.length; i++) {
		for ( var j = 0; j < calarrays[i].length; j++) {
			if (calarrays[i][j]!=0) {
				var vy = calarrays[i][j];
				
				if (vy>0) {
					var vx = Math.floor(Math.random()*9);
					var actor= new CAAT.Actor()
					.setBackgroundImage(numberImages.getRef(),true)
					.setSpriteIndex((vx*9) + (vy-1))
					.setPosition(i * numberImages.singleWidth , j * numberImages.singleHeight);
					calarrays[i][j] = vx + "-" + vy;
					actor.mouseDown = actorMouseDown;
					squareContainer.addChild(actor);
					actorsPlaced[i][j] = actor;
				} else {
					var actor= new CAAT.Actor()
					.setBackgroundImage(extraImages.getRef(),true)
					.setSpriteIndex(2)
					.setScale(.9, .9)
					.setPosition(i * numberImages.singleWidth , j * numberImages.singleHeight);
					actor.mouseDown = actorMouseDown;
					squareContainer.addChild(actor);
					calarrays[i][j] = "a-3";
					actorsPlaced[i][j] = actor;
				}
			} 
		}
	}
	
	levelInfo.setText(gamectx.level + "级");
	cleanQuene();
	numbers = riddlesRemains[t].clone();
	_pushInNumber();
	isPendding = false;
	maxScoreActor.setVisible(false);
}


function initGameCtx(leveled) {
	isPendding = false;
	gameModel = MODEL_LEVEL;
	for ( var i = 0; i < actorsPlaced.length; i++) {
		for ( var j = 0; j < actorsPlaced[i].length; j++) {
			if (actorsPlaced[i][j]!=0 && actorsPlaced[i][j]!=null) {
				actorsPlaced[i][j].setExpired(0);
			}
		}
	}
	
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
	setScore(0);
	cleanQuene();
	placed = 0;
	if (leveled) {
		gamectx.level = 0;
		goCommonNextLevel();
	} else { //不会再发生的情况
		gamectx.level = 100;
		goCommonNextLevel();
		gamectx.remains = Number.MAX_VALUE;
	}
	
	maxScoreActor.setVisible(true);
	//showPenddingInfo();
}

function goCommonNextLevel() {
	gamectx.level ++;
	levelInfo.setText(gamectx.level + "级");
	gamectx.remains = getLevelBlocks(gamectx.level);

	for ( var i = 0; i < 7; i++) {
		putInQueue();
	}
	_pushInNumber();
}

function checkOnBoards() {
	
	if (gameModel==MODEL_LEVEL) {
		goCommonNextLevel();
	}
	
	if (gameModel==MODEL_RIDDLE) {
		var finished = true;
		for ( var i = 0; i < calarrays.length; i++) {
			for ( var j = 0; j < calarrays[i].length; j++) {
				if (calarrays[i][j]!=0) {
					finished = false;
					break;
				}
			}
		}
		if(finished) {
			showPenddingInfo([ID_BTN_NEXT,ID_BTN_RESTART], 0);
			//initRiddle(30);
		} else {
			showPenddingInfo([ID_BTN_RESTART], 1);
		}
	}
}


function onNextButtonClicked() {
	if (gameModel==MODEL_LEVEL) {
		goCommonNextLevel();
	}
	
	if (gameModel==MODEL_RIDDLE) {
		gamectx.level ++;
		localStorage.setItem("riddle.level", gamectx.level);
		initRiddle(gamectx.level);
	}
	hidePenddingContainer();
}


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
	initialize(director.getImage('bgstart'), 1, 1);
	
	startContainer.setBackgroundImage(bgimage.getRef(), true);//.setBackgroundImageOffset(-300,-1200);
	
	var btnStartLevelImg = new CAAT.SpriteImage().
	initialize(director.getImage('btnstartLevel'), 4, 2);

	var logoImg = new CAAT.SpriteImage().
	initialize(director.getImage('logo'), 1, 1);
	
	var btnEmptyImg = new CAAT.SpriteImage().
	initialize(director.getImage('btnEmpty'), 1, 1);
	
	txtinfoImages = new CAAT.SpriteImage().
	initialize(director.getImage('txtinfo'), 4, 2);
	
	var logoActor= new CAAT.Actor().setBackgroundImage(logoImg.getRef(), true)
		.setLocation(width/2-145,50);
	startContainer.addChild(logoActor);
	
	var b1= new CAAT.Actor()
		.setAsButton(
					btnStartLevelImg.getRef(), 0, 0, 1, 1, onGameStartClicked
	     ).setLocation(width/2-85,height/2);
	startContainer.addChild(b1);
	
	var b2= new CAAT.Actor()
		.setAsButton(btnStartLevelImg.getRef(), 2, 2, 3, 3, onRiddleClicked
			).setLocation(width/2-85, height/2+60);
	startContainer.addChild(b2);
	
	var exitBtn = new CAAT.Actor()
	.setAsButton(btnStartLevelImg.getRef(), 4, 4, 5, 5, onAppCloseClicked
	).setLocation(width/2-85, height/2+120);
	startContainer.addChild(exitBtn);
	
	repeatPlay("/android_asset/www/mm.mid");
}

function onGameStartClicked(button) {
	if (mapScene==null) {
		initLevelsScene();
	}
	
	initGameCtx(true);
	director.setScene(director.getSceneIndex(mapScene));
}

function onRiddleClicked(button) {
	if (mapScene==null) {
		initLevelsScene();
	}
	if (localStorage.getItem("riddle.level")!=null) {
		gamectx.level = parseInt(localStorage.getItem("riddle.level"));
	} else {
		gamectx.level = 0;
	}
	initRiddle(gamectx.level);
	director.setScene(director.getSceneIndex(mapScene));
}

function onAppCloseClicked(button) {
	navigator.app.exitApp();
}
/**
 * 初始化游戏屏幕
 */
function initLevelsScene() {
	mapScene = director.createScene();
	mapContainer = new CAAT.ActorContainer().
	setBounds(0, 0, director.width, director.height);
	mapScene.addChild(mapContainer);

	squareContainer = new CAAT.ActorContainer().
	setBounds(0, director.height-board_height, board_width, board_height);
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
	initialize(director.getImage('extras'), 9, 1);
	var chessbgImages =  new CAAT.SpriteImage().
	initialize(director.getImage('chessbg'), 1, 1);
	var bgimage= new CAAT.SpriteImage().
	initialize(director.getImage('background'), 1, 1);
	
	mapContainer.setBackgroundImage(bgimage.getRef(), true);//.setBackgroundImageOffset(-300,-1300);
	squareContainer.setBackgroundImage(chessbgImages.getRef(), true).setBackgroundImageOffset(0,0);
	
	flyNearCloud('cloudfar', 2, mapContainer);
	flyNearCloud('cloudnear', 1, mapContainer);

	var penddingImg = new CAAT.SpriteImage().
	initialize(director.getImage('penddingbtn'), 1, 2);
	var btnPendding= new CAAT.Actor()
	.setAsButton(
			penddingImg.getRef(), 0, 0, 1, 1, onPenddingClick
     ).setLocation(5,5);
	mapContainer.addChild(btnPendding);
	
	/*
	var animalsImg= new CAAT.SpriteImage().
	initialize(director.getImage('animals'), 1, 1);
	
	var animals= new CAAT.Actor().
	setBackgroundImage(animalsImg.getRef(), true).
	setLocation(55, 50);
	mapContainer.addChild(animals);
	*/
	
	
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

/**
 * 显示信息栏，  并提供返回等按钮。
 */
var penddingContainer = null;
var ID_PASS_INFO = "info.passed";


var ID_BTN_NEXT = "btn.nextlevel";
var ID_BTN_CONTINUE = "btn.continueLevel";
var ID_BTN_RESTART = "btn.restart";

/***
 * 显示中断栏。 如果还未初始化，则初始化container
 * @param btns 显示的按钮数组。
 * @param idx 暂时不用
 */
function showPenddingInfo(btns, idx) {
	ready = false;
	isPendding = true;
	if (penddingContainer==null) {
		//初始化
		penddingContainer = new CAAT.ActorContainer();
		mapScene.addChild(penddingContainer);

		var numberImages= new CAAT.SpriteImage().
		initialize(director.getImage('penddingbg'), 1, 1);
		penddingContainer.setBackgroundImage(numberImages.getRef(), true);

		var menuBtn = new CAAT.Actor()
		.setAsButton(
				txtinfoImages.getRef(),
				4, 4, 5, 5, gotoMenu
		).setLocation(45,20);
		penddingContainer.addChild(menuBtn);
		
		var nextBtn= new CAAT.Actor()
		.setAsButton(
					txtinfoImages.getRef(),
					0, 0, 1, 1, onNextButtonClicked
	     ).setLocation(penddingContainer.width-100,penddingContainer.height-60);
		
		nextBtn.setId(ID_BTN_NEXT);
		penddingContainer.addChild(nextBtn);
		
		var continueBtn= new CAAT.Actor()
		.setAsButton(
					txtinfoImages.getRef(),
					6, 6, 7, 7, continueLevel
	     ).setLocation(penddingContainer.width-100,penddingContainer.height-160);
		
		continueBtn.setId(ID_BTN_CONTINUE);
		penddingContainer.addChild(continueBtn);
		
		var refreshBtn= new CAAT.Actor()
		.setAsButton(
					txtinfoImages.getRef(),
					2, 2, 3, 3, refreshLevel
	     ).setLocation(penddingContainer.width-180,penddingContainer.height-60);
		refreshBtn.setId(ID_BTN_RESTART);
		penddingContainer.addChild(refreshBtn);
	}
	
	//penddingContainer.findActorById(ID_PASS_INFO).setSpriteIndex(idx);
	
	if (btns.indexOf(ID_BTN_NEXT)>-1) {
		penddingContainer.findActorById(ID_BTN_NEXT).setVisible(true);
		penddingContainer.findActorById(ID_BTN_NEXT).setPosition(45, 240);
	} else {
		penddingContainer.findActorById(ID_BTN_NEXT).setVisible(false);
		penddingContainer.findActorById(ID_BTN_NEXT).setPosition(-200,-200);
	}
	
	if (btns.indexOf(ID_BTN_CONTINUE)>-1) {
		penddingContainer.findActorById(ID_BTN_CONTINUE).setVisible(true);
		penddingContainer.findActorById(ID_BTN_CONTINUE).setPosition(45, 80);
	} else {
		penddingContainer.findActorById(ID_BTN_CONTINUE).setVisible(false);
		penddingContainer.findActorById(ID_BTN_CONTINUE).setPosition(-200,-200);
	}

	if (btns.indexOf(ID_BTN_RESTART)>-1) {
		penddingContainer.findActorById(ID_BTN_RESTART).setVisible(true);
		penddingContainer.findActorById(ID_BTN_RESTART).setPosition(45, 140);
	} else {
		penddingContainer.findActorById(ID_BTN_RESTART).setVisible(false);
		penddingContainer.findActorById(ID_BTN_RESTART).setPosition(-200,-200);
	}
	if (btns.indexOf(ID_BTN_NEXT)>-1) {
		penddingContainer.findActorById(ID_BTN_NEXT).setVisible(true);
		penddingContainer.findActorById(ID_BTN_NEXT).setPosition(45, 80);
	} else {
		penddingContainer.findActorById(ID_BTN_NEXT).setVisible(false);
		penddingContainer.findActorById(ID_BTN_NEXT).setPosition(-200,-200);
	}
	var path= new CAAT.LinearPath()
	.setInitialPosition(director.width/2 - 120, -300)
	.setFinalPosition(director.width/2 - 120, 120);
	
	var pb = new CAAT.PathBehavior()
	  .setPath(path)
	  .setFrameTime(mapScene.time, 400);
	var alpha = new CAAT.AlphaBehavior().setValues(.2, 1).setFrameTime(mapScene.time, 400);
	penddingContainer.addBehavior(pb).addBehavior(alpha);
}

function onPenddingClick() {
	if (gameModel==MODEL_LEVEL) {
		showPenddingInfo([ID_BTN_CONTINUE],2);
	} else if (gameModel==MODEL_RIDDLE) {
		showPenddingInfo([ID_BTN_CONTINUE,ID_BTN_RESTART],2);	
	}
}

function continueLevel() {
	hidePenddingContainer();
}

function refreshLevel() {
	if (gameModel==MODEL_LEVEL) {
		hidePenddingContainer(initGameCtx(true));
	} else if (gameModel==MODEL_RIDDLE) {
		gamectx.level --;
		onNextButtonClicked();	
	}
}

function gotoMenu() {
	cleanQuene();
	
	if (penddingContainer!=null) {
		penddingContainer.setPosition(director.width/2 - 120, -400);
		/*
		penddingContainer.emptyChildren();
		penddingContainer.setExpired(0);
		penddingContainer = null;
		*/
	}
	
	if (gameModel==MODEL_LEVEL) {
		setMaxScore();
	}
	
	director.setScene(director.getSceneIndex(startScene));
}

function setMaxScore() {
	var maxScore = 0;
	if (localStorage.getItem("riddle.max")!=null) {
		maxScore = parseInt(localStorage.getItem("riddle.max"));
	}
	
	if (score>maxScore) {
		localStorage.setItem("riddle.max", score);
		maxScoreActor.setText("最高分:" + score);
		alert("恭喜您打破最高分记录 :" + score + "分!");
	}
}

function hidePenddingContainer(cb) {
	if (penddingContainer!=null) {
		var path= new CAAT.LinearPath()
		.setFinalPosition(director.width/2 - 120, -400)
		.setInitialPosition(director.width/2 - 120 , 100);
		var pb = new CAAT.PathBehavior()
		  .setPath(path)
		  .setFrameTime(mapScene.time, 400);
		penddingContainer.addBehavior(pb).addListener( {
			behaviorExpired : function() {
				cb;
				//penddingContainer.emptyChildren();
				//penddingContainer.setExpired(0);
				//penddingContainer = null;
			}
		} );
	}
	isPendding = false;
	ready = true;	
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
var maxScoreActor = null;
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
	
	var maxScore = 0;
	if (localStorage.getItem("riddle.max")!=null) {
		maxScore = parseInt(localStorage.getItem("riddle.max"));
	}
	
	maxScoreActor = new CAAT.TextActor().
	setFont("14px sans-serif").
	setText("最高分:" + maxScore).
	setOutlineColor('white').
	calcTextSize(director).
	setTextAlign("center").
	setLocation(-90, 10);
	//setOutline(true);
	scoreContainer.addChild(maxScoreActor);
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
	        	  //当移动发生并且执行完检查后，不剩余方块则跳到下一关
	        	  if (numbers.length==0) {
	        		  checkOnBoards();
	      		  }
	          }
	      });
		moving.actor.addBehavior(pb);
		moving = null;
	}
}



/**用于移动处理 当鼠标点击方块时选择移动的源*/
function actorMouseDown(me) {
	
	if (numbers.length==0) return;
	
	var info = numbers[0].split("-");
	var type = info[0];
	var n = info[1]
	if (type=="a") {
		var ax = Math.floor((me.screenPoint.x-squareContainer.x) / numberImages.singleWidth);
		var ay = Math.floor((me.screenPoint.y-squareContainer.y) / numberImages.singleHeight);
		
		if (n=="1") { //mark as move
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
		
		if (n=="2") { //remove one
			var number = numbers.shift();
			var actor = numberActors.shift();
			actor.setExpired(0);
			removeBlock(ax, ay, "zoomout");
			if (numbers.length==0) {
				checkOnBoards();
			} else {
				generateNextBlock();
			}
		}
		
		if (n=="5") {  //+1
			var number = numbers.shift();
			var actor = numberActors.shift();
			actor.setExpired(0);
			incBlock(ax, ay, 1);

			generateNextBlock();
			
			//checkAndRemove(ax, ay);
		}
		
		if (n=="6") {  //+1
			var number = numbers.shift();
			var actor = numberActors.shift();
			actor.setExpired(0);
			incBlock(ax, ay, -1);

			generateNextBlock();
			
			//checkAndRemove(ax, ay);
		}
	}
}


/**道具被放置到棋盘后的效果处理*/
function doExtras(number, actor, x, y) {
	
	var extraNumber = number.split("-")[1];
	
	if (extraNumber=="1" || extraNumber=="2" || extraNumber=="5") {  //放弃操作
		calarrays[x][y] = 0;
		actorsPlaced[x][y] = null;
		actor.setExpired(0);
		placed --;
		return;
	}
	/*
	
	if (extraNumber=="2") {  //抠掉一个方块。  放弃
		calarrays[x][y] = 0;
		actorsPlaced[x][y] = null;
		actor.setExpired(0);
		placed --;
		return;
	}
		if (extraNumber=="5") { // +1
		calarrays[x][y] = 0;
		actorsPlaced[x][y] = null;
		actor.setExpired(0);
		placed --;
		return;
	}
	*/
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
	if (!ready || isPendding) return;
	if (moving!=null) {
		doMoving(me);
		return;
	}
	
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
        		  checkOnBoards();
        	  } else {
        		  generateNextBlock();
        	  }
        	  playPut();
          }
      } );
	actor.addBehavior(pb);
	
}

/**根据等级等信息 随机生成下一个方块*/
function generateNextBlock() {
	
	if (gameModel==MODEL_LEVEL) {
		gamectx.remains --;
		
		if (gamectx.remains<=7) {
			
		} else {
			putInQueue();
		}
		_pushInNumber();
	}
	
	if (gameModel==MODEL_RIDDLE) {
		_pushInNumber();
	}
}

/**随机生成一个候选的方块*/
function putInQueue() {
	if (Math.random()<0.1 && gamectx.level>1) {
		pp  = gamectx.level;
		if (pp>6) pp=6;
		numbers.push("a-" + (Math.floor(Math.random()*pp)+1));
	} else {
		numbers.push((Math.floor(Math.random()*getLevelDiffs(gamectx.level))+1) + "-" + (Math.floor(Math.random()*9) + 1));
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
	
	var ra = xa%10; 
	var rb = xb%10;
	var rc = xc%10;
	var rd = xd%10;
	var re = xe%10;
	
	if (gameModel==MODEL_RIDDLE) {
		xa = ra; xb=rb; xc=rc; xd=rd; xe=re;
	}
	
	/*
	if (ra==rb && rb==rc && rc==rd && rd==re && rc>0) {
		removeBlock(x-2,y);
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		removeBlock(x+2,y);
		totalInc += ra + rb + rd + re;
	} else if (ra==rb && rb==rc && rc==rd && rc>0) {
		removeBlock(x-2,y);
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		totalInc += ra + rb + rd;
	} else if  (rb==rc && rc==rd && rd==re && rc>0) {
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		removeBlock(x+2,y);
		totalInc += rb + rd + re;
	} else if (ra==rb && rb==rc && rc>0) {
		removeBlock(x-2,y);
		removeBlock(x-1,y);
		totalInc += ra + rb;
	} else if  (rc==rd && rd==re && rc>0) {
		removeBlock(x+1,y);
		removeBlock(x+2,y);
		totalInc += rd + re;
	} else if  (rb==rc && rc==rd && rc>0) {
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		totalInc += rb + rd;
	} else */
	if (xa>0 && xb>0 && xc>0 && xd>0 && xe>0 && (xb-xa==xc-xb && xc-xb==xd-xc && xd-xc==xe-xd) && (Math.abs(xb-xa)==1 || xb==xa)) {
		removeBlock(x-2,y);
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		removeBlock(x+2,y);
		totalInc += ra + rb + rd + re;
	} else if (xa>0 && xb>0 && xc>0 && xd>0 && (xb-xa==xc-xb && xc-xb==xd-xc) && (xb==xa || Math.abs(xb-xa)==1)) {
		removeBlock(x-2,y);
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		totalInc += ra + rb + rd;
	} else if (xb>0 && xc>0 && xd>0 && xe>0 && (xc-xb==xd-xc && xd-xc==xe-xd) && (xc==xb || Math.abs(xc-xb)==1)) {
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		removeBlock(x+2,y);
		totalInc += rb + rd + re;
	} else if (xb>0 && xc>0 && xd>0 && (xc-xb==xd-xc) && (xc==xb || Math.abs(xc-xb)==1)) {
		removeBlock(x-1,y);
		removeBlock(x+1,y);
		totalInc += rb + rd;
	} 
	if (xd>0 && xc>0 && xe>0 && (xd-xc==xe-xd) && (xd==xc || Math.abs(xd-xc)==1) ) {
		removeBlock(x+1,y);
		removeBlock(x+2,y);
		totalInc += rd + re;
	} 
	if (xa>0 && xb>0 && xc>0 && (xb-xa==xc-xb) && (xb==xa || Math.abs(xb-xa)==1)) {
		removeBlock(x-2,y);
		removeBlock(x-1,y);
		totalInc += ra + rb;
	}
	
	var ya = getPosNumber(x, y-2);
	var yb = getPosNumber(x, y-1);
	var yc = getPosNumber(x, y);
	var yd = getPosNumber(x, y+1);
	var ye = getPosNumber(x, y+2);

	var rya = ya%10; 
	var ryb = yb%10;
	var ryc = yc%10;
	var ryd = yd%10;
	var rye = ye%10;
	
	if (gameModel==MODEL_RIDDLE) {
		ya = rya; yb = ryb; yc = ryc; yd = ryd; ye = rye;
	}
	
	/*
	if (rya==ryb && ryb==ryc && ryc==ryd && ryd==rye && ryc>0) {
		removeBlock(x,y-2);
		removeBlock(x,y-1);
		removeBlock(x,y+1);
		removeBlock(x,y+2);
		totalInc += rya + ryb + ryd + rye;
	} else if (rya==ryb && ryb==ryc && ryc==ryd && ryc>0) {
		removeBlock(x,y-2);
		removeBlock(x,y-1);
		removeBlock(x,y+1);
		totalInc += rya + ryb + ryd;
	} else if  (ryb==ryc && ryc==ryd && ryd==rye && ryc>0) {
		removeBlock(x,y-1);
		removeBlock(x,y+1);
		removeBlock(x,y+2);
		totalInc += ryb + ryd + rye;
	} else if (rya==ryb && ryb==ryc && ryc>0) {
		removeBlock(x,y-2);
		removeBlock(x,y-1);
		totalInc += rya + ryb;
	} else if  (ryc==ryd && ryd==rye && ryc>0) {
		removeBlock(x,y+1);
		removeBlock(x,y+2);
		totalInc += ryd + rye;
	} else if  (ryb==ryc && ryc==ryd && ryc>0) {
		removeBlock(x,y-1);
		removeBlock(x,y+1);
		totalInc += ryb + ryd;
	} else */
	if (ya>0&&yb>0&&yc>0&&yd>0&&ye>0 && (yb-ya==yc-yb && yc-yb==yd-yc && yd-yc==ye-yd) && (Math.abs(yb-ya)==1 || ya==yb)) {
		removeBlock(x,y-2);
		removeBlock(x,y-1);
		removeBlock(x,y+1);
		removeBlock(x,y+2);
		totalInc += rya + ryb + ryd + rye;
	} else if (ya>0&&yb>0&&yc>0&&yd>0 && (yb-ya==yc-yb && yc-yb==yd-yc) && (Math.abs(yb-ya)==1 || ya==yb)) {
		removeBlock(x,y-2);
		removeBlock(x,y-1);
		removeBlock(x,y+1);
		totalInc += rya + ryb + ryd;
	} else if (yb>0&&yc>0&&yd>0&&ye>0 && (yc-yb==yd-yc && yd-yc==ye-yd) && (Math.abs(yc-yb)==1 || yc==yb)) {
		removeBlock(x,y-1);
		removeBlock(x,y+1);
		removeBlock(x,y+2);
		totalInc += ryb + ryd + rye;
	} 
	if (ya>0&&yb>0&&yc>0 && (yb-ya==yc-yb) && (Math.abs(yb-ya)==1 || ya==yb)) {
		removeBlock(x,y-2);
		removeBlock(x,y-1);
		totalInc += rya + ryb;
	} 
	if (yb>0&&yc>0&&yd>0 && (yc-yb==yd-yc) && (Math.abs(yc-yb)==1 || yc==yb)) {
		removeBlock(x,y-1);
		removeBlock(x,y+1);
		totalInc += ryb + ryd;
	} 
	if (yc>0&&yd>0&&ye>0 && (yd-yc==ye-yd) && (Math.abs(yd-yc)==1 || yd==yc)) {
		removeBlock(x,y+1);
		removeBlock(x,y+2);
		totalInc += ryd + rye;
	}

	if (totalInc>0) {
		totalInc += rc;
		removeBlock(x,y);
		playRemove();
		setScore(score + totalInc);
	}
	
	if (placed>=75) {
		ready = false;
		showPenddingInfo([ID_BTN_RESTART], null);
		setMaxScore();
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
	if (calarrays[x][y].charAt(0)=='a') {
		return -5;
	}
	return parseInt(calarrays[x][y].split("-")[0])*10 + parseInt(calarrays[x][y].split("-")[1]);
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

function incBlock(x, y,inc) {
	var n = getPosNumber(x, y);

	var new_n = n + inc;
	if(new_n==10) new_n = 1;
	if(new_n==0) new_n = 9;

	var color = Math.floor(Math.random()*9);
	var new_value = color  + "-" + new_n;
	
	var actor = actorsPlaced[x][y]; 
	//actorsPlaced[x][y].setScale(.9,.9);
	
	actor.setSpriteIndex(color*9 + (new_n-1));
	
	var zoomout= new CAAT.ScaleBehavior().
    setFrameTime(actor.time, 300).
    setValues( .6, 1, .6,  1, .5, .5).
    addListener( {
        behaviorExpired : function(behavior, time, actor) {
        	checkAndRemove(x, y);
        	if (numbers.length==0) {
				checkOnBoards();
			}
        }
    });
	actor.addBehavior(zoomout);
	calarrays[x][y] = new_value;
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

/**将一个方块飞行到指定位置。 如果方块不存在，则直接创建。*/
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
		.setInitialPosition(width, -numberImages.singleWidth)
		.setFinalPosition(60 + pos*(numberImages.singleWidth), -numberImages.singleWidth);
		
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
		actor.setPosition(60 + pos*(numberImages.singleWidth), -(numberImages.singleWidth));
		squareContainer.addChild(actor);
		actor.mouseDown = actorMouseDown;
	} else {
		var path= new CAAT.LinearPath()
	    .setInitialPosition(actor.x,-numberImages.singleWidth)
	    .setFinalPosition(60 + pos*(numberImages.singleWidth), -numberImages.singleWidth);
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
		actor.setPosition(60 + pos*(numberImages.singleWidth), -numberImages.singleWidth);
	}
	return actor;
}


/**将队列清除*/
function cleanQuene() {
	for ( var i = 0; i < numberActors.length; i++) {
		numberActors[i].setExpired(0);
	}
	numberActors = [];
	numbers = [];
}


if (!Array.prototype.clone ) {
	  Array.prototype.clone = function() {
	    var arr1 = new Array();
	    for (var property in this) {
	        arr1[property] = typeof(this[property]) == 'object' ? this[property].clone() : this[property]
	    }
	    return arr1;
	  }
}


function repeatPlay(src) {
	if (isPhone) {
		var my_media = new Media(src, function(){
			my_media.play();
		}, function(){});
		my_media.play();
	}
}


var putMedia;
var removeMedia;
if (isPhone) {
	putMedia = new Media("/android_asset/www/put.mp3",  function(){},  function(){});
	removeMedia = new Media("/android_asset/www/remove.mp3",  function(){},  function(){});
}

function playRemove() {
	if (isPhone) {
		removeMedia.play();
	}
}

function playPut() {
	if (isPhone) {
		putMedia.play();
	}
}


function playAudio(src) {
	if (isPhone) {
		var my_media = new Media(src, onSuccess, onError);
		// Play audio
		my_media.play();
	}
}

function onSuccess() {
	
}
function onError(error) {

}




