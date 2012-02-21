/**
 * 
 */
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
	return false;
}

//竖线
function checkVerticals(source, target, array) {
	for ( var i = 0; i < array[0].length; i++) {
		if (checkConnective({x:source.x, y:i}, source, array) 
				&& checkConnective({x:target.x, y:i}, target, array)
				&& checkConnective({x:source.x, y:i}, {x:target.x, y:i}, array)) {
			return {a:{x:source.x, y:i}, b:{x:target.x, y:i}};
		}
	}
	return false;
}

//横线
function checkHorizontals(source, target, array) {
	for ( var i = 0; i < array.length; i++) {
		if (checkConnective({x:i, y:source.y}, source, array) 
				&& checkConnective({x:i, y:target.y}, target, array)
				&& checkConnective({x:i, y:target.y}, {x:i, y:source.y}, array)) {
			return {a:{x:i,y:target.y}, b:{x:i,y:source.y}};
		}
	}
	return false;
}


//检查位于1条直线上的2个点是否能联通
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
		
		for ( var i = from+1; i<to ; i++) {
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
		
		for ( var i = from+1; i<to ; i++) {
			if (array[i][source.y]!='') {
				return false;
			}
		}
		return true;
	}
}


function getHint(array) {
	
}
