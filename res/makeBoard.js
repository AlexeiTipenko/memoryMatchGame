/*
COMP 2406 - Assignment 3
Name: Alexei Tipenko (100995947)
Date: Sunday, November 13th, 2016
*/


/*Provided function that creates a new board
with randomized vlaues */
function makeBoard(size){
	//assume size%2==0

  items = [];
  for(var i=0;i<(size*size)/2;i++){
  	items.push(i);
  	items.push(i);
  }


  board = [];
  for(var i=0;i<size;i++){
  	board[i]=[]
  	for(var j=0;j<size;j++){
  		var r = (Math.floor(Math.random()*items.length));
  		board[i][j]= items.splice(r,1)[0];  //remove item r from the array

  	}
  }
  return board;
}

module.exports.makeBoard = makeBoard;
