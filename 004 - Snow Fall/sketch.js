var flakes = [];

var gr;

function setup(){
	createCanvas(600,400);
	gr = createVector(0, 0.05);
	for(var i=0; i < 50; i++){
		flakes[i] = new SnowFlake(random(width), random(-60,-10), min(random(5,15), random(5,15)));
	}
}

function draw(){
	background(51);
	var wind = createVector(0,0);
	if(random(0,1) < 0.2){
		wind = createVector(random(-2,2), random(0,0.8));
	}
	for(var i=0; i < flakes.length; i++){
		flakes[i].applyForce(gr.copy().mult(flakes[i].r*flakes[i].r));
		flakes[i].applyForce(wind.copy());
		flakes[i].update();
		flakes[i].show();
		if(flakes[i].isOutOfScreen()){
			flakes[i].reset();
		}
	}
}

function SnowFlake(x, y, radius){
	this.pos = createVector(x,y);
	this.vel = createVector(0,0);
	this.acc = createVector(0,0);
	this.branches = 2 * round(random(3,4));
	this.angle = TWO_PI / this.branches;
	this.r = radius;

	this.applyForce = function(force){
		var realF = force.div(this.r);
		this.acc.add(realF);
	}

	this.update = function(){
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	this.show = function(){
		stroke(255);
		noFill();
		var agl = 0;
		for(var i = 0; i < this.branches; i++){
			this.drawArm(this.pos, this.r, agl, 0);
			agl += this.angle;
		}
	}

	this.drawArm = function(origin, length, angle, recLevel){
		var cosa = (cos(angle));
		var sina = (sin(angle));
		var endX = length * cosa;
		var endY = length * sina;
		line(origin.x, origin.y, origin.x + endX, origin.y + endY);
		if(recLevel >= 1){
			return;
		}

		var step = length / 3;
		var end = length-step;
		for(var i=0; i < end; i+=step){
			var origX = origin.x + i * cosa;
			var origY = origin.y + i * sina;
			this.drawArm(createVector(origX, origY), length / 3, angle - QUARTER_PI, recLevel+1);
			this.drawArm(createVector(origX, origY), length / 3, angle + QUARTER_PI, recLevel+1);
		}
	}

	this.reset = function(){
		this.pos = createVector( random(width), random(-60,-10) );
		this.vel = createVector(0,0);
		this.acc = createVector(0,0);
		this.branches = 2 * round(random(3,4));
		this.angle = TWO_PI / this.branches;
		this.r = min(random(5,15), random(5,15));
	}

	this.isOutOfScreen = function(){
		return (this.pos.y > (height + this.r));
	}
}