var cells = [];
var colors = [];

var im;
var pixelsToProccess = [];

function setup(){
	createCanvas(600,400);
	im = createImage(width, height);
	var margin = 10;
	for (var i = 0; i < 30; i++) {
		cells[i] = createVector(round(random(margin, width-margin)), round(random(margin, height-margin)));
		colors[i] = randomColor();
		pixelsToProccess[i] = cells[i];
	}
	background(51);
}

function draw(){
	im.loadPixels();
	for(var i=pixelsToProccess.length-1; i >= 0; i--){
		var pixel = pixelsToProccess[i];
		if(pixel.x >= 0 && pixel.x < width &&
			pixel.y >= 0 && pixel.y < height){
			var idx = (pixel.x + (pixel.y * width))*4 ;
			if(im.pixels[idx] === 0){
				var closest = findClosest(pixel);
				im.pixels[idx] = colors[closest].levels[0];
				im.pixels[idx+1] = colors[closest].levels[1];
				im.pixels[idx+2] = colors[closest].levels[2];
				im.pixels[idx+3] = 255;
				pixelsToProccess.push(createVector(pixel.x-1, pixel.y));
				pixelsToProccess.push(createVector(pixel.x+1, pixel.y));
				pixelsToProccess.push(createVector(pixel.x, pixel.y-1));
				pixelsToProccess.push(createVector(pixel.x, pixel.y+1));
			}
		}
	}
	im.updatePixels();
	image(im, 0,0);
	stroke(0);
	strokeWeight(4);
	for(c of cells){
		point(c.x, c.y);
	}
}

function findClosest(p){
	var minD = Number.MAX_VALUE;
	var closestIndex = -1;
	for(var i=0; i < cells.length; i++){
		var d = p.dist(cells[i]);
		if(d < minD){
			minD = d;
			closestIndex = i;
		}
	}

	return closestIndex;
}

function randomColor(){
	var r = round(random(50,255));
	var g = round(random(50,255));
	var b = round(random(50,255));
	return color(r,g,b);
}