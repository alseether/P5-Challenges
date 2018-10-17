var flakes = [];

var gr;


function setup(){
	createCanvas(600,400);
	gr = createVector(0, 0.05);
	for(var i=0; i < 20; i++){
		flakes[i] = new SnowFlake(random(width), random(-20,-10), random(5,15));
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
		for(var i = 0; i < this.branches; i++){
			var a = (TWO_PI * i) / this.branches;
			this.drawArm(this.pos, this.r, a);
		}
	}

	this.drawArm = function(origin, length, angle){
		if(length < 1){
			return;
		}
		var endX = length * (cos(angle));
		var endY = length * (sin(angle));
		line(origin.x, origin.y, origin.x + endX, origin.y + endY);
		var step = length / 5;
		for(var i=0; i < length; i+=step){
			var origX = origin.x + i * (cos(angle));
			var origY = origin.y + i * (sin(angle));
			this.drawArm(createVector(origX, origY), length / 3, angle - QUARTER_PI);
			this.drawArm(createVector(origX, origY), length / 3, angle + QUARTER_PI);
		}
	}

	this.reset = function(){
		this.pos = createVector( random(width), random(-20,-10) );
		this.vel = createVector(0,0);
		this.acc = createVector(0,0);
		this.branches = 2 * round(random(3,4));
		this.r = random(20,50);
	}

	this.isOutOfScreen = function(){
		return (this.pos.y > (height + this.r));
	}
}