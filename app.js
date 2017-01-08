/*
COMP 2406 - Assignment 3
Name: Alexei Tipenko (100995947)
Date: Sunday, November 13th, 2016
*/

//An asynchronous server that serves static files
// load necessary modules
var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
var url = require('url');

var createBoard = require('./res/makeBoard.js');
var users = {};																								//Dictionary of users
var userRowLen = {};																					//Dictionary of user's current board length

const ROOT = "./public_html";

// create http server
var server = http.createServer(handleRequest);
server.listen(2406);
console.log('Server listening on port 2406');

function handleRequest(req, res) {

	//process the request
	console.log(req.method+" request for: "+req.url);

	//parse the url
	var urlObj = url.parse(req.url,true);
	var filename = ROOT+urlObj.pathname;
	var pathname = urlObj.pathname;
	var query = urlObj.query;

	if (pathname === "/memory/intro") {

		var board = new Object();																		//Make a new board
		var username = query.username;															//grab username

		if (users.hasOwnProperty(username)) {												//if username already exists
			if (userRowLen[username] < 12) {													//if the row length is smaller than 12
				userRowLen[username] += 2;															//increment row length by 2
				board = createBoard.makeBoard(userRowLen[username]);			//make new board of new length
				users[username] = board;																	//Add board to corresponding user
			}

			else {
				board = createBoard.makeBoard(userRowLen[username]);			//otherwise, make new board of same size
				users[username] = board;																	//Add board to corresponding user
			}
		}

		else {
			userRowLen[username] = 4;																	//Otherwise, make a new board of size 4
			board = createBoard.makeBoard(4);
			users[username] = board;																	//Add board to corresponding user
		}

		var level = {value: userRowLen[username]};
		respond(200, JSON.stringify(level));												//Send json object of the row length
	}

	else if (pathname === "/memory/card") {

		var username = query.username;
		var board = users[username];																//Grab username, board, row/column index
		var rowIdx = query.row;
		var colIdx = query.col;

		var cardVal = {cardNum: board[rowIdx][colIdx]};
		respond(200, JSON.stringify(cardVal));											//Send json object of value at index selected
	}

	else {
	//the callback sequence for static serving...
		fs.stat(filename,function(err, stats){

			if(err)respondErr(err);   //try and open the file and handle the error, handle the error

			else{

				if(stats.isDirectory()) filename+="/index.html";

				fs.readFile(filename,"utf8",function(err, data){
					if(err)respondErr(err);
					else respond(200,data);
				});
			}
		});
	}

	//locally defined helper function
	//serves 404 files
	function serve404(){
		fs.readFile(ROOT+"/404.html","utf8",function(err,data){ //async
			if(err)respond(500,err.message);
			else respond(404,data);
		});
	}

	//locally defined helper function
	//responds in error, and outputs to the console
	function respondErr(err){
		console.log("Handling error: ",err);
		if(err.code==="ENOENT"){
			serve404();
		}else{
			respond(500,err.message);
		}
	}

	//locally defined helper function
	//sends off the response message
	function respond(code, data){
		// content header
		res.writeHead(code, {'content-type': mime.lookup(filename)|| 'text/html'});
		// write message and signal communication is complete
		res.end(data);
	}
};//end handle request
