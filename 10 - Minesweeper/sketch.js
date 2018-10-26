var cellSize = 40;
var mineRatio = 0.1;

var rows, cols;
var board = [];
var discovered = [];

var MINE_VALUE = 10;

var gameOver;


function setup(){
	createCanvas(12*cellSize,6*cellSize);
	cols = width / cellSize;
	rows = height / cellSize;

	gameOver = false;

	initializeBoard();

}

function restart(){
	gameOver = false;

	initializeBoard();
	loop();
}


function draw(){	
	background(51);
	stroke(200);
	fill(127,50);

	textSize(16);
	ellipseMode(CENTER);
	textAlign(CENTER, CENTER);
	
	for(var i=0; i < cols; i++){
		for (var j = 0; j < rows; j++) {
			if(discovered[i][j]){
				fill(75);
				stroke(200);
				rect((i*cellSize), (j*cellSize), cellSize, cellSize);
				if(board[i][j] == MINE_VALUE){
					noStroke();
					fill(200,0,0);
					ellipse((i*cellSize) + cellSize/2, (j*cellSize) + cellSize/2, 16);
				}
				else{
					noStroke();
					fill(0,127,250);
					if(board[i][j] != 0){
						text(board[i][j], (i*cellSize) + cellSize/2, (j*cellSize) + cellSize/2);
					}
				}
			}
			else{
				fill(127);
				stroke(200);
				rect((i*cellSize), (j*cellSize), cellSize, cellSize);
			}
		}
	}

	if(gameOver){
		textSize(50);
		fill(255);
		noStroke();
		text('GAME OVER', width/2, height/2);
		textSize(16);
		text('Click to restart', width/2, height * 0.75);
		noLoop();
	}
	if(checkWin()){
		textSize(50);
		fill(255);
		noStroke();
		text('YOU WIN!', width/2, height/2);
		textSize(16);
		text('Click to restart', width/2, height * 0.75);
		gameOver = true;
		noLoop();
	}

}

function initializeBoard(){
	for(var i=0; i < cols; i++){
		discovered[i] = [];
		board[i] = [];
		for (var j = 0; j < rows; j++) {
			discovered[i][j] = false;
			board[i][j] = 0;
		}
	}

	var nMines = floor((cols * rows) * mineRatio);

	for(var i=0; i < nMines; i++){
		var x,y;
		do{
			x = floor(random(cols));
			y = floor(random(rows));
		}while(board[x][y] == MINE_VALUE);
		board[x][y] = MINE_VALUE;
	}

	for(var i=0; i < cols; i++){
		for (var j = 0; j < rows; j++) {
			if(board[i][j] != MINE_VALUE){
				board[i][j] = minesAround(i,j);
			}
		}
	}
}

function minesAround(x,y){
	var count = 0;
	var initX = x-1;
	var endX = x+1;
	var initY = y-1;
	var endY = y+1;
	if(x == 0){
		initX = x;
	}
	if(x == cols-1){
		endX = x;
	}
	if(y == 0){
		initY = y;
	}
	if(y == rows-1){
		endY = y;
	}

	for(var i = initX; i <= endX; i++){
		for(var j=initY; j <= endY; j++){
			if(board[i][j] == MINE_VALUE){
				count++;
			}
		}
	}

	return count;
}

function mouseReleased(){
	if(gameOver){
		restart();
		return;
	}
	var colClicked = floor(mouseX / cellSize);
	var rowClicked = floor(mouseY / cellSize);

	gameOver = !discover(colClicked, rowClicked);
}

function discover(x,y){
	if(x < 0 || x >= cols || y < 0 || y >= rows){
		return true;
	}
	if(discovered[x][y]){
		return true;
	}

	discovered[x][y] = true;

	if(board[x][y] == MINE_VALUE){
		return false;
	}

	if(board[x][y] == 0){
		for(var i = x-1; i <= x+1; i++){
			for(var j = y-1; j <= y+1; j++){
				discover(i,j);
			}	
		}
	}
	return true;
}

function checkWin(){
	for(var i=0; i < cols; i++){
		for (var j = 0; j < rows; j++) {
			if(board[i][j] != MINE_VALUE && !discovered[i][j]){
				return false;
			}
		}
	}

	return true;
}