/**
 * 
 */

/**
 * 0:下
 * 1：左
 * 2：右
 * 3:上
 * */


var hostiledx;
var hostiledy;

var attacking = {};

function attack(actor1, actor2) {
	attacking[actor1.getId()] = actor2.getId();

	var srcx = Math.floor((actor1.x + actor1.width)/block_width);
	var srcy = Math.floor((actor1.y + actor1.height)/block_width);
	
	var targetx = Math.floor((actor2.x + actor2.width)/block_width);
	var targety = Math.floor((actor2.y + actor2.height)/block_width);
	
	var deltax = targetx - srcx;
	var deltay = targety - srcy;
	
	var src_delta_x;
	var src_delta_y;
	var src_direction;
	var target_delta_x;
	var target_delta_y;
	var target_direction;
	
	
	if (Math.abs(deltax) + Math.abs(deltay)==1) {
		doAttack(actor1, actor2);
		return;
	} else if (Math.abs(deltax)==1 && Math.abs(deltay)==1) {
		src_delta_x = 0;
		src_delta_y = (deltay>0) ? (srcy+1)*block_width : (srcy-1)*block_width;
		
		src_direction = (deltay>0) ? 0 : 3;
		target_direction = (deltay>0) ? 3 : 0;
		
		target_delta_x = 0;
		target_delta_y = 0;
	} else {
		if (Math.abs(deltax) > Math.abs(deltay)) {
			if (deltax>0) {
				src_delta_x = (srcx + 1) * block_width;
				src_delta_y = 0;
				target_delta_x = (srcx - 1) * block_width;
				target_delta_y = 0;
				src_direction = 2;
				target_direction = 1;
			} else {
				src_delta_x = (srcx - 1) * block_width;
				src_delta_y = 0;
				target_delta_x = (srcx + 1) * block_width;
				target_delta_y = 0;
				src_direction = 1;
				target_direction = 2;
			}
		} else {
			if (deltay>0) {
				src_delta_x = 0;
				src_delta_y = (srcy + 1) * block_width;
				target_delta_x = 0;
				target_delta_y = (srcy - 1) * block_width;
				src_direction = 0;
				target_direction = 3;
			} else {
				src_delta_x = 0;
				src_delta_y = (srcy - 1) * block_width;
				target_delta_x = 0;
				target_delta_y = (srcy + 1) * block_width;
				src_direction = 3;
				target_direction = 0;
			}
		}
	}
	move(actor1, src_direction);
	move(actor2, target_direction);
}

function doAttack(actor1, actor2) {
	alert("attack");
}



function moveTo(actor, tox, toy) {
	attacking[actor.getId()] = null;
}

