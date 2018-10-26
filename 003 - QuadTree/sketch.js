var qtree;
var queryArea;

function setup(){
	createCanvas(600,400);
	qtree = new QuadTree(new Rectangle(0,0, width, height), 4);
	queryArea = new Rectangle(0,0, 100,60);
}

function draw(){
	background(51);
	if(frameCount % 25 == 0){
		// Each 25 frames, add random point to map
		qtree.add(createVector(random(width), random(height)));
	}

	// Set queryArea where mouse is
	queryArea.x = mouseX - queryArea.w/2;	
	queryArea.y = mouseY - queryArea.h/2;

	qtree.show();

	// Draw Query Area
	stroke(0,255,0);
	noFill();
	rect(queryArea.x, queryArea.y, queryArea.w,queryArea.h);

	// Look for contained points and draw them
	var found = qtree.query(queryArea);
	for(point of found){
		stroke(0,255,0);
		fill(0,255,0);
		ellipse(point.x, point.y, 8);
	}

}

function mouseReleased(){
	// You can manually add a point into the qtree
	qtree.add(createVector(mouseX,mouseY));
}

function QuadTree(range, n){
	this.max = n;		// Number of elements before divide
	this.nw = null;		// North-West division
	this.ne = null;		// North-East division
	this.sw = null;		// South-West division
	this.se = null;		// South-East division
	this.range = range;	// Rectangle to be covered by this QuadTree
	this.points = [];	// Points contained by this section

	this.divided = false;	// Has been divided yet?

	this.query = function(area, found){
		if(!found){
			found = [];
		}
		if(this.range.intersects(area)){
			for(point of this.points){
				if(area.contains(point)){
					found.push(point);
				}
			}
			if(this.divided){
				this.nw.query(area, found);
				this.ne.query(area, found);
				this.sw.query(area, found);
				this.se.query(area, found);
			}
		}

		return found;
	}

	this.add = function(point){
		if(this.range.contains(point)){
			if(this.divided){
				this.nw.add(point);
				this.ne.add(point);
				this.sw.add(point);
				this.se.add(point);
			}
			else{
				this.points.push(point);
				if(this.points.length >= this.max){
					this.divide();
				}
			}
		}
	}

	this.divide = function(){
		var halfW = this.range.w / 2;
		var halfH = this.range.h / 2;
		this.nw = new QuadTree(new Rectangle(this.range.x, 			this.range.y, 			halfW, halfH), this.max);
		this.ne = new QuadTree(new Rectangle(this.range.x + halfW, 	this.range.y, 			halfW, halfH), this.max);
		this.sw = new QuadTree(new Rectangle(this.range.x, 			this.range.y + halfH, 	halfW, halfH), this.max);
		this.se = new QuadTree(new Rectangle(this.range.x + halfW, 	this.range.y + halfH, 	halfW, halfH), this.max);

		this.divided = true;
	}

	this.show = function(){
		push();
		stroke(200);
		noFill();
		translate(this.range.x, this.range.y);
		rect(0,0,this.range.w,this.range.h);
		pop();
		for(var i=0; i < this.points.length; i++){
			stroke(100);
			fill(100);
			ellipse(this.points[i].x, this.points[i].y, 8);
		}
		if(this.divided){
			this.nw.show();
			this.ne.show();
			this.sw.show();
			this.se.show();
		}
	}

}

function Rectangle(x,y,w,h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.contains = function(point){
		return 	point.x > this.x && point.x < this.x + this.w &&
        		point.y > this.y && point.y < this.y + this.h;
	}

	this.intersects = function(other){
		return !(other.x > (this.x + this.w) || 
           		(other.x + other.w) < this.x || 
           		 other.y > (this.y + this.h) ||
           		(other.y + other.h) < this.y);
	}
}