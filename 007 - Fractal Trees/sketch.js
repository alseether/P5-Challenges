var t = [];
var trunkColor;
var leafColor;
var maxRecursionLevels = 9;

function setup(){
	createCanvas(600,400);
	trunkColor = color(160,94,24);
	leafColor = color(44,165,19);
	var posX = 100;
	var posY = height * 0.9;
	for(var i=0; i < 3; i++){
		var h = random(posY/5, posY/4);
		t[i] = new Tree(posX, posY, h);
		posX += 200;
	}
	frameRate(2);
}

function draw(){
	var tic = millis();
	background(51);
	stroke(255);
	for(tree of t){
		tree.show();
		tree.maxRec++;
		if(tree.maxRec === maxRecursionLevels){
			noLoop();
		}
	}
	var tac = millis();
}

function Tree(x,y, height){
	this.pos = createVector(x,y);
	this.h = height;
	this.R = random(0.6,0.8);
	this.A = PI / random(4.5,9);
	this.maxRec = 1;

	this.show = function(){
		this.showRec(this.pos.x, this.pos.y, this.h, HALF_PI,0);
	}

	this.showRec = function(x,y,l,a,recLevel){
		if (recLevel >= this.maxRec){
			return;
		}
		var nextX = x + (l * cos(a));
		var nextY = y - (l * sin(a));
		var c = lerpColor(leafColor, trunkColor, (l/this.h));
		var w = lerp(1,6, (l/this.h));
		stroke(c);
		strokeWeight(w);
		line(x,y, nextX, nextY);
		this.showRec(nextX, nextY, l*this.R, a-this.A, recLevel+1);
		this.showRec(nextX, nextY, l*this.R, a+this.A, recLevel+1);
	}
}