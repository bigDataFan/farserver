/**
 * 
 */

var ary = wrapArray(generateFromTemplate(generateRandomArray(10,10), 10));

var director;
var scene;
var splashScene;
var superClickActor;

var width = 600;
var height = 600;


var imageRes =  [
	{id:'d0',     url:'resource/0.png'} 
	,{id:'d1',     url:'resource/1.png'} 
	,{id:'d2',     url:'resource/2.png'}
	,{id:'d3',     url:'resource/3.png'} 
	,{id:'d4',     url:'resource/4.png'} 
	,{id:'d5',     url:'resource/5.png'} 
	,{id:'d6',     url:'resource/6.png'} 
	,{id:'d7',     url:'resource/7.png'} 
	,{id:'d8',     url:'resource/8.png'}
	,{id:'d9',     url:'resource/9.png'} 
	,{id:'d10',     url:'resource/10.png'}
];

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
			 [
			  {id:'splash', url:'logo.png'},
			  {id:'buttons', url:'botones.png'}
			 ],
			function(counter, images) {
				 if (counter==2) {
					 director.setImagesCache(images);
					 var starsImage = new CAAT.SpriteImage().initialize(director.getImage('splash'), 1,1);
					 
					 var actorStar = new CAAT.Actor().setBackgroundImage(starsImage.getRef(), true);
					 
					 var pathBehavior = new CAAT.PathBehavior()
					 	.setFrameTime( actorStar.time, 1000 )
					 	.setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator())
					 	.setValues(
					 			new CAAT.Path().setLinear(
					 					width/2-50,
					 					-100,
					 					width/2-50,
					 					50)
					 			 );
					 actorStar.addBehavior(pathBehavior);
					 acontainer.addChild(actorStar);
					 
					 

					 // an image of 7 rows by 3 columns
					 var btnImage= new CAAT.SpriteImage().initialize(
							 director.getImage('buttons'), 7, 3 );
					 
					 var b1= new CAAT.Actor()
					 			.setAsButton(
							                 btnImage.getRef(), 0, 1, 2, 0, function(button) {
												 director.switchToNextScene(
									                        1000,
									                        true,
									                        true
									                );
							                 }
							     ).setLocation(width/2,height/2-120);
					 var b2= new CAAT.Actor()
			 			.setAsButton(
					                 btnImage.getRef(), 3, 4, 5, 3, function(button) {
										 director.switchToNextScene(
							                        1000,
							                        true,
							                        true
							                );
					                 }
					     ).setLocation(width/2,height/2-60);
			
					 acontainer.addChild(b1);
					 acontainer.addChild(b2);
					 
					 loadResources();
				 }
			}
	);
}

function loadResources() {
	
	scene= director.createScene();
	
	//loadSplashScene();
	
	var acontainer = new CAAT.ActorContainer().
    	setBounds(0, 0, director.width, director.height);
    	//.setFillStyle('#fff')
    	//.setAlpha(0.5);
	
	scene.addChild(acontainer);
	
	var gradient= director.crc.createLinearGradient(0,0,0,50);
	   gradient.addColorStop(0,'green');
	   gradient.addColorStop(0.5,'red');
	   gradient.addColorStop(1,'yellow');

   superClickActor = new CAAT.TextActor().
    	setFont("20px sans-serif").
    	setText("连续点击可加分").
    	calcTextSize(director).
    	setTextAlign("center").
    	setTextFillStyle(gradient).
    	setOutline(true);
    	//.cacheAsBitmap();
   acontainer.addChild(superClickActor.setLocation((acontainer.width-300),20));
   
   new CAAT.ImagePreloader().loadImages(
				 imageRes,
				function(counter, images) {
					if (counter==11) {
						director.setImagesCache(images);
						
						for(var i=0; i<ary.length; i++) {
							for(var j=0; j<ary[i].length; j++) {
								if (ary[i][j]=='') continue;
								
								var v = 'd' + ary[i][j];
								var starsImage = new CAAT.SpriteImage().initialize(director.getImage(v), 1,1);
								
								var pathBehavior = new CAAT.PathBehavior()
								 	.setFrameTime( 500, 1000 )
								 	.setInterpolator(new CAAT.Interpolator().createBounceOutInterpolator())
								 	.setValues(
								 			new CAAT.Path()
								 			.setLinear(
	                                            //Math.random()<.5 ? scene.width+Math.random() * 50 : -50-Math.random()*scene.width,
	                                            i*50,
	                                            Math.random()<.5 ? scene.width+Math.random() * 50 : -50-Math.random()*scene.height,
	                                            i*50,
	                                            j*50
	                                        ));
								var actorStar = new CAAT.Actor().setBackgroundImage(starsImage.getRef(), true);
								//.setBounds(i*50, j*50 , 48,48)
								actorStar.addBehavior(pathBehavior);
								acontainer.addChild(actorStar);
								actorStar.mouseDown = spriteMouseDown;
							}
						}
					}
				}
		);
	  
	  
}

function start() {
	director = new CAAT.Director().initialize(
	        width, height,
	        document.getElementById('_c1'));
	
	loadSplashScene();
   CAAT.loop(60);
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



var src = null;
var srcActor = null;

function spriteMouseDown(me) {
	if (src==null) {
		src = {x: me.source.x/50, y:me.source.y/50};
		me.source.setAlpha(0.6);
		srcActor = me.source; 
	} else {
		var target = {x: me.source.x/50, y:me.source.y/50};
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
			showClicked(ddclick);
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
		superClickActor.setText(n + "次连击!");
		superClickActor.emptyBehaviorList();
		superClickActor.addBehavior(
				new CAAT.ScaleBehavior().
                setFrameTime( superClickActor.time, 300).
                setValues( 1, 2, 1, 2 ).
                setPingPong()
        );
	} else {
		superClickActor.setText("连续点击可加分");
	}
}







