var ants = [];
var food = [];
var poison = [];

var successorRate = 0.001;	// Probability to have a successor (per frame)
var agingRate = 0.01;		// How much health is diminished (per frame)

var CENTER;
var MARGIN = 25;

function setup(){
	createCanvas(600,400);
	CENTER = createVector(width/2, height/2);
	for(var i=0; i < 75; i++){
		food[i] = GetEdiblesSpawnPoint();
	}
	for(var i=0; i < 20; i++){
		poison[i] = GetEdiblesSpawnPoint();
	}
	for(var i=0; i < 25; i++){
		ants[i] = new Ant(random(width), random(height));
	}
}

function draw(){
	background(51);
	stroke(100);
	noFill();
	rect(MARGIN,MARGIN,width-MARGIN*2, height-MARGIN*2);
	for(var i=0; i < food.length; i++){
		noStroke();
		fill(0,255,0);
		ellipse(food[i].x, food[i].y, 6);
	}
		for(var i=0; i < poison.length; i++){
		noStroke();
		fill(255,0,0);
		ellipse(poison[i].x, poison[i].y, 6);
	}

	for(var i=ants.length-1 ; i >= 0; i--){
		var a = ants[i];
		a.eat(food, 0);
		a.eat(poison, 1);
		a.show();
		a.checkLimits();
		var suc = a.update();
		if(suc != null){
			ants.push(suc);
		}
		if(!a.isAlive()){
			ants.splice(i,1);
		}
	}

	if(ants.length <= 0){
		console.log("Simulation finished!");
		noLoop();
	}
}

function GetEdiblesSpawnPoint(){
	return createVector(random(MARGIN, width-MARGIN), random(MARGIN, height-MARGIN));
}

function Ant(x,y){
	this.pos = createVector(x,y);
	this.vel = createVector(random(0,1),random(0,1));
	this.acc = createVector(0,0);
	this.r = 8;						// Triangle "radius" (if that makes sense)

	this.dna = [];
	this.dna[0] = random(-2,2);		// Food atraction
	this.dna[1] = random(-2,2);		// Poison atraction
	this.dna[2] = random(0, 100);	// Food detection radius
	this.dna[3] = random(0, 100);	// Poison detection radius

	this.maxVel = 5;	// Max reachable speed
	this.maxAcc = 1;	// Max acceleration (force) to be applied

	this.health = 1.0;	// Initial health

	this.debugMode = false;	// To show debug info


	// Look for the nearest edible, if found, try to eat it. (Factor = 0 => Food; Factor = 1 => Poison)
	this.eat = function(edibles, factor){
		var nearest = this.findNearest(edibles, factor+2);
		if(nearest != -1){ 
			var d = p5.Vector.dist(edibles[nearest], this.pos);
			if(d < this.maxVel){
				edibles[nearest] = GetEdiblesSpawnPoint();
				if(factor == 0){
					// Eat Food
					this.health += 0.2;
				}
				else{
					// Eat Poison
					this.health -= 0.5;
				}
			}
			else{
				this.applyForce(this.seek(edibles[nearest]), this.dna[factor]);
			}
		}
	}

	this.isAlive = function(){
		return (this.health > 0);
	}
	

	// Return nearest (and reachable) edible index. (return -1 if none is close enough) (Factor = 2 => food, Factor = 3 => Poison)
	this.findNearest = function(edibles, factor){
		var minD = Number.MAX_VALUE;
		var nearest = -1;
		for(var i=0; i < edibles.length; i++){
			var distance = p5.Vector.dist(edibles[i], this.pos);
			if(distance < minD && distance < this.dna[factor]){
				minD = distance;
				nearest = i;
			}
		}

		if(nearest > -1){
			return nearest;
		}
		return -1;
	}

	// Return the combinated vector between the target position and the current speed
	this.seek = function(target){
		var desired = createVector(target.x - this.pos.x, target.y - this.pos.y);
		desired.normalize();
		desired.mult(this.maxVel);
		return p5.Vector.sub(desired, this.vel);
	}

	// Apply force at max acceleration
	this.applyForce = function(force){
		this.acc.add(force);
		this.acc.limit(this.maxAcc);
	}

	// Apply force at specified acceleration
	this.applyForce = function(force, mult){
		force.mult(mult);
		this.acc.add(force);
		this.acc.limit(this.maxAcc);
	}

	this.update = function(){
		if(!this.isAlive()){
			return null;
		}
		this.health -= agingRate;

		this.vel.add(this.acc);
		this.vel.limit(this.maxVel);
		this.pos.add(this.vel);
		this.acc.mult(0);

		if(random(0,1) < successorRate){
			return this.successor();
		}

		return null;
	}

	// Get a "mutated" copy
	this.successor = function(){
		var suc = new Ant(this.pos.x, this.pos.y);
		suc.dna[0] = this.dna[0] * random(0.2, 1.8);
		suc.dna[1] = this.dna[1] * random(0.2, 1.8);
		suc.dna[2] = this.dna[2] * random(0.2, 1.8);
		suc.dna[3] = this.dna[3] * random(0.2, 1.8);

		return suc;
	}

	this.show = function(){
		if(!this.isAlive()){
			return;
		}
		var angle = PI / 6;
		var green = color(0,255,0);
		var red = color(255,0,0);
		var col = lerpColor(red,green, this.health);
		noStroke();
		fill(col);
		push();
		translate(this.pos.x, this.pos.y);
		rotate(HALF_PI + this.vel.heading());
		var front = createVector(0, - this.r);
		var left = createVector(-this.r*(sin(angle)), this.r*(cos(angle)));
		var right = createVector(this.r*(sin(angle)), this.r*(cos(angle)));
		triangle(front.x, front.y, left.x, left.y, right.x, right.y);
		if(this.debugMode){
			// Debug info
			noFill();
			stroke(0,255,0);
			ellipse(0,0, this.dna[2]);
			stroke(255,0,0);
			ellipse(0,0, this.dna[3]);
		}
		pop();
	}

	this.checkLimits = function(){
		if(this.pos.x < MARGIN || this.pos.x > (width - MARGIN)
		|| this.pos.y < MARGIN || this.pos.y > (height - MARGIN)){
			this.applyForce(this.seek(CENTER), 10);
		}
	}

	this.setDebugMode = function(debMode){
		this.debugMode = debMode;
	}
}