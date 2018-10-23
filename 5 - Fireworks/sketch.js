var fw = [];
var gr;		// Gravity

function setup(){
	createCanvas(600,400);
	fw[0] = new Firework(random(width), height, random(-5,-8));
	gr = createVector(0,0.1);
}

function draw(){
	background(51, 100); // Some alpha to create trail effect

	// 5% chance of creating a new Firework
	if(random(0,1) < 0.05){
		var newFw = new Firework(random(width), height, random(-5,-8));
		fw.push(newFw);
	}
	for(var i = fw.length-1; i >= 0; i--){
		fw[i].applyForce(gr);
		fw[i].update();
		fw[i].show();
		if(!fw[i].isAlive()){
			fw.splice(i,1);
		}
	}
}

function Firework(x, y, yVel){
	this.me = new Particle(x,y,0,yVel, randomColor(), Number.MAX_VALUE, 5);
	this.particles = [];

	this.applyForce = function(force){
		if(this.me.isAlive()){
			this.me.applyForce(force);
		}
		for(p of this.particles){
			p.applyForce(force);
		}
	}

	this.update = function(){
		if(this.me.isAlive()){
			this.me.update();
			if(this.me.vel.y >= 0){
				this.me.lifetime = 0;	// Kill myself
				// Create my explosion particles
				for(var i=0; i < 30; i++){
					this.particles[i] = new Particle(this.me.pos.x, this.me.pos.y, random(-2, 2), random(-3,1), this.me.color, round(random(127,255)), 3);
				}
			}
		}

		for(var i = this.particles.length-1; i >= 0; i--){
			this.particles[i].update();
			if(!this.particles[i].isAlive()){
				this.particles.splice(i,1);
			}
		}
	}

	this.show = function(){
		if(this.me.isAlive()){
			this.me.show();
		}
		for(p of this.particles){
			p.show();
		}
	}

	this.isAlive = function(){
		return (this.me.isAlive() || (this.particles.length > 0));
	}
}

function Particle(x,y, xVel, yVel, col, lt, r){
	this.pos = createVector(x,y);
	this.vel = createVector(xVel,yVel);
	this.acc = createVector(0,0);
	this.r = r;
	this.lifetime = lt;
	this.color= col;

	this.applyForce = function(force){
		if(!this.isAlive()){
			return;
		}
		this.acc.add(force);
	}

	this.update = function(){
		if(!this.isAlive()){
			return;
		}
		this.lifetime -= 2;
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	this.show = function(){
		if(!this.isAlive()){
			return;
		}
		this.color.levels[3] = this.lifetime;
		stroke(this.color);
		strokeWeight(this.r);
		point(this.pos.x, this.pos.y);
	}

	this.isAlive = function(){
		return (this.lifetime > 0);
	}
}

function randomColor(){
	var r = round(random(50,255));
	var g = round(random(50,255));
	var b = round(random(50,255));
	return color(r,g,b);
}