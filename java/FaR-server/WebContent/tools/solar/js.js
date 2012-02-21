var classes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
var bR, bS, tM, oT, tI, hS;
var counts = [], bM = [], pP = [];
var pA = false, mP = 1;

$(document).ready(function() {
	setScale();
	$(window).resize(setScale);
	if (!('ontouchstart' in document)) {
		$('body').addClass('pc');
	}
	$('#s1').click(function() {
		$('#s1').hide();
		gameStart();
		$('#s2').show();
	});
});

function gameStart() {
	setBlocks();
	tM = $('#a1 div.tm');
	hS = $('#a1 div.hs');
	oT = new Date();
	tI = setInterval("setTimer()", 1000);
	setHs();
	$('.ht').click(hint);
	$('.b3').click(reset);
}

function setScale() {
	var wtt = $(window).width();
	var htt = $(window).height();
	var sl = Math.min(wtt, htt);
	if(sl < 500) {
		var bodyScale = (sl * .357);
		if(wtt > htt) $('body').addClass('ld');
		else $('body').removeClass('ld');
	}
	else if(wtt > (htt * .6)){
		var bodyScale = (htt * .18);
		$('body').removeClass('ld');
	}
	else {
		var bodyScale = (wtt * .3);
		$('body').removeClass('ld');
	}
	$('body').css('font-size', bodyScale + '%');
}

function setBlocks() {
	bR = 0;
	counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	var mR = 5, mC = 6;
	var tempFloor, tempRow, tempBlock;
	var floors = $('ul');
	floors.empty();
	for (var f = 0; f < 4; f++) {
		bM[f] = [];
		for (var r = 0; r < mR; r++) {
			bM[f][r] = [];
			tempRow = $('<li></li>');
			$(floors[f]).append(tempRow);
			for (var c = 0; c < mC; c++) {
				var randomNoRequired = true;
				var randomClass;
				while(randomNoRequired) {
					randomClass = Math.round(Math.random() * 10 + 0);
					if (counts[randomClass] < 6 || bR >= 66) {
						randomNoRequired = false;
					}
				}
				if (bR > 65) {
					tempBlock = $('<a class="a" data-t="a" style="display:none;"></a>');
					bM[f][r][c] = {idx:null,type:null,v:0,e:null};
				} else {
					tempBlock = $('<a class="' + classes[randomClass] + '" data-i="' + bR + '" data-t="' + classes[randomClass] + '" data-f="' + f + '" data-r="' + r + '" data-c="' + c + '"></a>');
					bM[f][r][c] = {idx:bR,type:classes[randomClass],v:1,e:tempBlock};
					counts[randomClass]++;
					bR++;
				}
				tempBlock.css('margin-top', ((-(mR * 3.05 / 2) + (3.05 * r)) - .15) + 'em');
				tempBlock.css('margin-left', (-(mC * 2.3 / 2) + (2.3 * c)) + 'em');
				tempRow.append(tempBlock);
			}
		}
		mR--;
		mC--;
	}
	if (!checkAllBlocks()) {
		setBlocks();
	} else {
		$('#s2 a').click(function(){
			var cB = $(this);
			var f = parseInt(cB.attr('data-f'));
			var r = parseInt(cB.attr('data-r'));
			var c = parseInt(cB.attr('data-c'));
			if (pA == false && !isClickAllowed(f,r,c)) {
				return false;
			}
			cB.addClass('ss');
			if (bS) {
				if ($(bS).attr('data-i') == cB.attr('data-i')) {
					cB.removeClass('ss');
				} else {
					if ($(bS).attr('data-t') == cB.attr('data-t')) {
						$(bS).addClass('x');
						cB.addClass('x');
						bR = bR - 2;
						turnoffMatrix($(bS));
						turnoffMatrix(cB);
						$('body').removeClass('pw');
						pA = false;
					} else {
						$(bS).removeClass('ss');
						cB.removeClass('ss');
					}
				}
				bS = null;
			} else {
				bS = this;
			}

			if (bR == 0) {
				clearInterval(tI);
				enddingProcess();
				//$('#s2').hide();
				$('#s3').show();
			} else {
				if (checkAllBlocks() == false && pA == false) {
					if (mP > 0) {
						$('#ms').html('<h2>No More Moves Left</h2>You only have one chance to use super power.<br>Choose a pair of blocks wisely.<br><div id="b1">Power</div>');
						$('#mw').show();
						$('#b1').click(power);
					} else {
						clearInterval(tI);
						$('#ms').html('<h2>No More Moves Left</h2>Game Over. Try again.<br><div class="b3">RESTART</div>');
						$('#mw').show();
						$('#ms div.b3').click(reset);
					}				
				}
			}
		});
	}
}

function isClickAllowed(f, r, c) {
	var fR = false, cR = false;

	if (f == 3) {
		fR = true;
	} else {
		if (typeof bM[f+1][r-1] == 'undefined') {
			if (typeof bM[f+1][r][c-1] == 'undefined') {
				if (bM[f+1][r][c].v == 0) {
					fR = true;	
				}
			} else if (bM[f+1][r][c-1].v == 0) {
				if (typeof bM[f+1][r][c] == 'undefined') {
					fR = true;
				} else if (bM[f+1][r][c].v == 0) {
					fR = true;
				}
			}
		} else if (typeof bM[f+1][r] == 'undefined') {
			if (typeof bM[f+1][r-1][c-1] == 'undefined') {
				if (bM[f+1][r-1][c].v == 0) {
					fR = true;
				}
			} else if (bM[f+1][r-1][c-1].v == 0) {
				if (typeof bM[f+1][r-1][c] == 'undefined') {
					fR = true;
				} else if ( bM[f+1][r-1][c].v == 0) {
					fR = true;
				}
			}
		} else {
			if (typeof bM[f+1][r-1][c-1] == 'undefined' && typeof bM[f+1][r][c-1] == 'undefined') {
				if (bM[f+1][r-1][c].v == 0 && bM[f+1][r][c].v == 0) {
					fR = true;
				}
			} else if (typeof bM[f+1][r-1][c] == 'undefined' && typeof bM[f+1][r][c] == 'undefined') {
				if (bM[f+1][r-1][c-1].v == 0 && bM[f+1][r][c-1].v == 0) {
					fR = true;
				}
			} else {
				if (bM[f+1][r-1][c-1].v == 0 && bM[f+1][r][c-1].v == 0 && bM[f+1][r-1][c].v == 0 && bM[f+1][r][c].v == 0) {
					fR = true;
				}
			}
		}
	}

	if (c == 0) {
		cR = true;
	}

	if (typeof bM[f][r][c-1] == 'undefined') {
		cR = true;
	} else if (bM[f][r][c-1].v == 0) {
		cR = true;
	}

	if (typeof bM[f][r][c+1] == 'undefined') {
		cR = true;
	} else if (bM[f][r][c+1].v == 0) {
		cR = true;
	}

	return (fR && cR);
}

function turnoffMatrix(el) {
	var f = parseInt(el.attr('data-f'));
	var r = parseInt(el.attr('data-r'));
	var c = parseInt(el.attr('data-c'));
	bM[f][r][c].v = 0;
}

function checkAllBlocks(sB) {
	var mR = 5, mC = 6;
	var checkResult;
	for (var f = 0; f < 4; f++) {
		for (var r = 0; r < mR; r++) {
			for (var c = 0; c < mC; c++) {
				if(!sB) {
					if (bM[f][r][c].v == 1 && isClickAllowed(f,r,c)) {
						checkResult = checkAllBlocks(bM[f][r][c]);
						if (checkResult) {
							return true;
						}
					}
				} else {
					if (sB.idx != bM[f][r][c].idx) {
						if (sB.type == bM[f][r][c].type) {
							if (bM[f][r][c].v == 1 && isClickAllowed(f,r,c)) {
								pP = [sB, bM[f][r][c]];
								return true;
							}
						}
					}
					
				}
			}
		}
		mR--;
		mC--;
	}
	pP = [];
	return false;
}

function setTimer() {
	var n = new Date();
	tM.text(getTimeText(n.getTime() - oT.getTime()));
}

function setHs() {
	if (typeof localStorage.highscore == 'undefined') {
		//hS.text('Try the first Record!');
	} else {
		hS.text(getTimeText(parseInt(localStorage.highscore)));
	}
}
function getTimeText(v) {
	var vH = Math.floor(v / 3600000);
	var vM = Math.floor((v - (vH * 3600000)) / 60000);
	var vS = Math.floor((v - (vH * 3600000) - (vM * 60000)) / 1000);
	return set2Digit(vH) + ':' + set2Digit(vM) + ':' + set2Digit(vS);
}

function set2Digit(ov) {
	var os = '0' + ov;
	return os.substr(os.length - 2, 2);
}

function enddingProcess() {
	var n = new Date();
	var tG = n.getTime() - oT.getTime();
	var oHs = (typeof localStorage.highscore == 'undefined') ? 0 : parseInt(localStorage.highscore);
	var mHs = (oHs == 0) ? tG : Math.min(tG, oHs);
	localStorage.setItem('highscore', mHs);
}

function power() {
	if (mP > 0) {
		pA = true;
		mP--;
		$('#mw').hide();
		$('body').addClass('pw');
	} else {
		alert('no more power');
	}
}

function pickATopBlock(oB) {
	var mR = 2, mC = 3;
	for (var f = 3; f >= 0; f--) {
		for (var r = 0; r < mR; r++) {
			for (var c = 0; c < mC; c++) {
				if (oB) {
					if (bM[f][r][c].v == 1 && bM[f][r][c].type == oB.type && bM[f][r][c].idx != oB.idx) {
						return bM[f][r][c];
					}
				} else {
					if (bM[f][r][c].v == 1) {
						return bM[f][r][c];
					}
				}
			}
		}
		mR++;
		mC++;
	}
}

function reset() {
	$('#s3').hide();
	$('#s2').show();
	setBlocks();
	clearInterval(tI);
	oT = new Date();
	tI = setInterval("setTimer()", 1000);
	$('#mw').hide();
	$('.ht').show();
	setHs();
	mP = 1;
	bS = null;
}

function hint() {
	if (pA == true) {
		alert('Now\'s the power mode. Select a pair of blocks.');
		return false;
	}
	$(this).hide(500);
	checkAllBlocks();
	var tf = function() {
		$(this).removeClass('htb');
	};
	if ($.browser.webkit) {
		pP[0].e.bind('webkitAnimationEnd', tf);
		pP[1].e.bind('webkitAnimationEnd', tf);
	} else {
		pP[0].e.bind('animationend', tf);
		pP[1].e.bind('animationend', tf);
	}
	pP[0].e.addClass('htb');
	pP[1].e.addClass('htb');
}