var buffer1;
var buffer2;
var cooling;

var noiseY;

function setup(){
	createCanvas(600,150);
	buffer1 = createImage(width, height, RGB);
	buffer2 = createImage(width, height, RGB);
	cooling = createImage(width, height, RGB);

	noiseY = 0;
}

function draw(){
	background(51);
	cool();
	buffer1.loadPixels();
	buffer2.loadPixels();
	cooling.loadPixels();

	// The more loops in this for, the faster fire will spread
	for(var times = 0; times < 4; times++){
		fire(2);
		for(var i=1; i < width-1; i++){
			for(var j=1; j < height-1; j++){
				var idx0 = ((i) + (j) * width) * 4;		// Current pixel
				var idx1 = ((i+1) + (j) * width) * 4;	// Right
				var idx2 = ((i-1) + (j) * width) * 4;	// Left
				var idx3 = ((i) + (j+1) * width) * 4;	// Down
				var idx4 = ((i) + (j-1) * width) * 4;	// Up

				var c1 = buffer1.pixels[idx1];
				var c2 = buffer1.pixels[idx2];
				var c3 = buffer1.pixels[idx3];
				var c4 = buffer1.pixels[idx4];

				var col = (c1 + c2 + c3 + c4) * 0.25;	// Fire spread

				col = col - cooling.pixels[idx0];		// Cooling

				buffer2.pixels[idx4] = col;
				buffer2.pixels[idx4+1] = 0;
				buffer2.pixels[idx4+2] = 0;
				buffer2.pixels[idx4+3] = 255;
				
			}
		}
		buffer2.updatePixels();

		var temp = buffer1;
		buffer1 = buffer2;
		buffer2 = temp;

		noiseY += 0.03;
	}	

	image(buffer2, 0, 0);
}

function fire(rows){
	buffer1.loadPixels();
	for(var i=0; i < width; i++){
		for(var j=0; j < rows; j++){
			var y = height-(j+1);
			var index = (i + y * width) * 4;
			var strenght = random(220, 255);
			buffer1.pixels[index] = strenght;
			buffer1.pixels[index+1] = 0;
			buffer1.pixels[index+2] = 0;
			buffer1.pixels[index+3] = 255;
		}
	}
	buffer1.updatePixels();
}

function cool(){
	var scale = 0.02;
	noiseDetail(8, 0.65);
	cooling.loadPixels();
	for(var j=0; j < height; j++){
		for(var i=0; i < width; i++){
			var index = (i + j * width) * 4;
			var c = noise(i*scale, noiseY + (j*scale)) * 5;
			cooling.pixels[index] = c;
			cooling.pixels[index+1] = c;
			cooling.pixels[index+2] = c;
			cooling.pixels[index+3] = 255;
		}
	}
	cooling.updatePixels();
}