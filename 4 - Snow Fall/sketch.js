var flakes = [];

var gr;


function setup(){
	createCanvas(600,400);
	gr = createVector(0, 0.05);
	for(var i=0; i < 30; i++){
		flakes[i] = new SnowFlake(random(width), random(-60,-10), min(random(2,15), random(2,15)));
	}
}

function draw(){
	background(51);
	for(var i=0; i < flakes.length; i++){
		flakes[i].applyForce(gr.copy());
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
		force.mult(this.r*0.2);
		this.acc.add(force);
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
		if(length < (this.r / 5) || recLevel >= 2){
			return;
		}
		var cosa = (cos(angle));
		var sina = (sin(angle));
		var endX = length * cosa;
		var endY = length * sina;
		line(origin.x, origin.y, origin.x + endX, origin.y + endY);
		var step = length / 5;
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
		this.r = min(random(2,15), random(2,15));
	}

	this.isOutOfScreen = function(){
		return (this.pos.y > (height + this.r));
	}
}