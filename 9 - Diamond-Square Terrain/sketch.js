var len = 7;
var w,h;

var terrain = [];

var cellSize = 20;
var minH;
var maxH;

var pers, incr;

function setup(){
	createCanvas(800,600,WEBGL);
	w = pow(2, len)+1;
	h = w;

	for(var i= 0; i < w; i++){
		terrain[i] = [];
		for(var j= 0; j < h; j++){
			terrain[i][j] = 0;
		}
	}

	generateTerrain(w-1);

	minH = Number.MAX_VALUE;
	maxH = Number.MIN_VALUE;
	for(var i= 0; i < w; i++){
		for(var j= 0; j < h; j++){
			var val = terrain[i][j];
			if(val > maxH){
				maxH = val;
			}
			if(val < minH){
				minH = val;
			}
		}
	}

	pers = PI/20;
	incr = 0.03;
}



function draw(){	
	background(51);
	stroke(255,50);
	strokeWeight(1);
	fill(127,50);

	translate(-400,-200);
	rotateX(pers);
	translate(-w/2, -h/2);

	for(var i= 0; i < w-1; i++){
		beginShape(TRIANGLE_STRIP);
		for(var j= 0; j < h; j++){
			var val1 = map(terrain[j][i], minH, maxH, -100, 100, true);
			var val2 = map(terrain[j][i+1], minH, maxH, -100, 100, true);
			vertex(j*cellSize, i*cellSize, val1);
			vertex(j*cellSize, (i+1)*cellSize, val2);
		}
		vertex(h*cellSize, w*cellSize, val2);
		endShape();
	}
	
	pers += incr;
	if(pers <= PI/20 || pers >= PI/2.8){
		incr = -incr;
	}
}

function generateTerrain(scale){
	terrain[0][0] = random(50,200);
	terrain[0][h-1] = random(50,200);
	terrain[w-1][0] = random(50,200);
	terrain[w-1][h-1] = random(50,200);

	while(scale >= 2){
		for(var i=0; i < w-1; i += scale){
			for(var j=0; j < h-1; j+= scale){
				square(i,j,scale);
			}
		}
		scale = floor(scale/2);
		var i = scale;
		for(var j=0; j < h; j+= scale) {
			if(i >= w){
				i = i % (scale*2);
				i = scale - i;
			}
			while(i < w){
				diamond(i,j,scale);
				i += (scale*2);
			}
		}
	}
}

function square(x,y,scale){
	var v1 = terrain[x][y];
	var v2 = terrain[x+scale][y];
	var v3 = terrain[x][y+scale];
	var v4 = terrain[x+scale][y+scale];

	var avg = (v1+v2+v3+v4) / 4;
	avg *= random(0.8,1.2);

	var midX = floor((x + (x+scale)) / 2);
	var midY = floor((y + (y+scale)) / 2);

	terrain[midX][midY] = avg;
}

function diamond(x,y, scale){
	var v = [];
	var sum = 0;
	var count = 0;
	v[0] = getValue(x-scale, y);
	v[1] = getValue(x+scale, y);
	v[2] = getValue(x, y-scale);
	v[3] = getValue(x, y+scale);

	for(val of v){
		sum += val;
		if(val > 0){
			count++;
		}
	}

	var avg = sum / count;
	avg *= random(0.8,1.2);

	terrain[x][y]=avg;
}

function getValue(x,y){
	if(x < 0 || x >= w || y < 0 || y >= h){
		return 0;
	}
	return terrain[x][y];
}
