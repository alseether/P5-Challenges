var w,h;
var cols, rows;
var cellSize = 20;

var terrain = [];

var incX = 0.1;
var incY = 0.1;

var initY = 0;

function setup(){
	createCanvas(600,400, WEBGL);
	w = 2*width;
	h = 2*height;
	cols = w/cellSize;
	rows = w/cellSize;

	for(var i= 0; i < cols; i++){
		terrain[i] = [];
		for(var j= 0; j < rows; j++){
			terrain[i][j] = 0;
		}
	}
}

function draw(){
	background(51);
	stroke(255,50);
	strokeWeight(1);
	fill(127,50);
	initY += 0.03;
	var yOff = initY;
	for(var i= 0; i < rows; i++){
		var xOff = 0;
		for(var j= 0; j < cols; j++){
			terrain[j][i] = map(noise(xOff, yOff), 0,1,-100,200);
			xOff += incX;
		}
		yOff += incY;
	}

	translate(0,50);
	rotateX(PI/3);
	translate(-w/2, -h/2);
	for(var i= 0; i < rows-1; i++){
		beginShape(TRIANGLE_STRIP);
		for(var j= 0; j < cols; j++){
			vertex(j*cellSize, i*cellSize, terrain[j][i]);
			vertex(j*cellSize, (i+1)*cellSize, terrain[j][i+1]);
		}
		vertex(cols*cellSize, i*cellSize, terrain[cols-1][i]);
		endShape();
	}
}
