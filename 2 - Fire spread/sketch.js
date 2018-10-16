var buffer1;
var buffer1;
var cooling;

function setup(){
	createCanvas(200,400);
	buffer1 = createImage(width, height, RGB);
	buffer2 = createImage(width, height, RGB);
	cooling = createImage(width, height, RGB);
}

function draw(){
	background(0);
	fire(2);
	buffer1.loadPixels();
	buffer2.loadPixels();
	for(var i=1; i < width-1; i++){
		for(var j=1; j < height-1; j++){
			var idx0 = (i) 	 + (j)	*width;
			var idx1 = (i+1) + (j)	*width;
			var idx2 = (i-1) + (j)	*width;
			var idx3 = (i) 	 + (j+1)*width;
			var idx4 = (i) 	 + (j-1)*width;
			var c1 = buffer1.get(i+1,j);
			var c2 = buffer1.get(i-1,j);
			var c3 = buffer1.get(i,j+1);
			var c4 = buffer1.get(i,j-1);

			var col = 	brightness(c1) + 
						brightness(c2) + 
						brightness(c3) + 
						brightness(c4);
			col *= 0.25;

			buffer2.set(i, j-1, color(col));
		}
	}
	buffer2.updatePixels();

	var temp = buffer1;
	buffer1 = buffer2;
	buffer2 = temp;

	image(buffer2, 0 ,0);
	
}

function fire(rows){
	buffer1.loadPixels();
	for(var i=0; i < width; i++){
		for(var j=0; j < rows; j++){
			var y = height-(j+1);
			var index = i + y*width;
			buffer1.set(i, y, color(200));
		}
	}
	buffer1.updatePixels();
}