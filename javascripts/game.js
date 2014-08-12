/*global Kinetic */

"use strict";
var gStage;
var gLayer;
var gPlayerScoresDiv;
var gPlayerNamesDiv;
var gGridSizeDiv;
var gNumberofPlayersDiv;
var gNumberofRows = 5;
var gMaxNumberOfPlayers = 3;	//if you change this, change var colors[] also.
var gNumberofPlayers = 3;
var gWidthBetweenEachDot = 80;
var gBoardWidth = gNumberofRows * gWidthBetweenEachDot;

var gDots = [];
var gLines = [];

var players = [];
var currentPlayer;

//Should be as long as max number of players, at least.
var colors = [ "#854646", "#465085", "#F0CA05" ];

function player(name, color) {
	/*jshint validthis: true */
	this.name = name;
	this.color = color;
	this.score = 0;

	this.reset = function () {
		this.score = 0;
	};
}

function populateSettings() {
	var infoString = "";
	for (var i = 0; i < gNumberofPlayers; i++)
	{
		infoString = infoString + "<span id=\"player" + i + "name\" onclick=\"exchange(this.id)\">" + players[i].name + "</span><input id=\"player" + i + "nameb\" class=\"replace\" type=\"text\" value= \"" + players[i].name + "\" style=\"display:none\"/><br>";
	}
	gPlayerNamesDiv.innerHTML = infoString;
	gGridSizeDiv.innerHTML = "<span id=\"gridSz\" onclick=\"exchange(this.id)\">" + gNumberofRows + "</span><input id=\"gridSzb\" class=\"replace\" type=\"text\" value= \"" + gNumberofRows + "\" style=\"display:none\"/><br>";
	gNumberofPlayersDiv.innerHTML = "<span id=\"NumofPlayers\" onclick=\"exchange(this.id)\">" + gNumberofPlayers + "</span><input id=\"NumofPlayersb\" class=\"replace\" type=\"text\" value= \"" + gNumberofPlayers + "\" style=\"display:none\"/><br>";
}
function point(x,y) {
	/*jshint validthis: true */
	this.x = x;
	this.y = y;
}

function displayScore()
{
	var infoString = "";
	for (var i = 0; i < players.length; i++)
	{
		infoString = infoString + "<span style='color:" + players[i].color +  "'>" + players[i].name + ": " + players[i].score + "</span><br>";
	}
	gPlayerScoresDiv.innerHTML = infoString;
}

function changePlayer()
{
	var currentIndex = players.indexOf(currentPlayer);
	currentPlayer = (currentIndex == players.length - 1) ? players[0] : players[currentIndex + 1];
}

function checkForCompleteSquares(newSelectedLine)
{
	//If the line is horizontal, then check up and down 
	var output = [];
	var Rowv, Rowh, Colv, Colh, RowhBottom, RowhTop, ColvLeft, ColvRight, ColhRight, IndexRightVertical, IndexLeftVertical, IndexBottomHorizontal, IndexTopHorizontal, IndexUpHorizontal;
	if (newSelectedLine % 2 === 0)
	{
		Rowh = Math.floor(newSelectedLine/(2*(gNumberofRows - 1)));
		Colh = (newSelectedLine % (2*(gNumberofRows - 1))) / 2;
		//If the line is at the top row, then we only have to check the box underneath
		if (Rowh < gNumberofRows - 1)
		{
			//Check the row below
			Rowv = Rowh;
			ColvLeft = Colh;
			ColvRight = Colh + 1;

			IndexLeftVertical = (Rowv*2 + 1) + (2*(gNumberofRows - 1)) * ColvLeft;
			IndexRightVertical = (Rowv*2 + 1) + (2*(gNumberofRows - 1)) * ColvRight;
			IndexBottomHorizontal = newSelectedLine + (2*(gNumberofRows - 1));
			if (gLines[IndexLeftVertical].capturedLine && 
				gLines[IndexRightVertical].capturedLine && 
				gLines[IndexBottomHorizontal].capturedLine)
			{
				//Insert the Center of a complete square into the array
				output[output.length] = new point((gLines[newSelectedLine].x2 + gLines[newSelectedLine].x1)/2 - gWidthBetweenEachDot/2, gLines[newSelectedLine].y1);
			}
		}

		if (Rowh > 0)
		{
			//Check the row above
			Rowv = Rowh - 1;
			ColvLeft = Colh;
			ColvRight = Colh + 1;

			IndexLeftVertical = (Rowv*2 + 1) + (2*(gNumberofRows - 1)) * ColvLeft;
			IndexRightVertical = (Rowv*2 + 1) + (2*(gNumberofRows - 1)) * ColvRight;
			IndexUpHorizontal = newSelectedLine - (2*(gNumberofRows - 1));
			if (gLines[IndexLeftVertical].capturedLine && 
				gLines[IndexRightVertical].capturedLine && 
				gLines[IndexUpHorizontal].capturedLine)
			{
				//Insert the Center of a complete square into the array
				output[output.length] = new point((gLines[newSelectedLine].x2 + gLines[newSelectedLine].x1)/2 - gWidthBetweenEachDot/2, gLines[newSelectedLine].y1 - gWidthBetweenEachDot);
			}
		}
	}
	else
	{
		Rowv = Math.floor(((newSelectedLine) % (2*(gNumberofRows - 1))) / 2);
		Colv = Math.floor((newSelectedLine) / (2 * (gNumberofRows - 1)));

		if (Colv < gNumberofRows - 1)
		{
			//Check right
			RowhTop = Rowv;
			RowhBottom = Rowv + 1;
			ColhRight = Colv;

			IndexTopHorizontal = RowhTop*(2*(gNumberofRows - 1)) + 2*ColhRight;
			IndexBottomHorizontal = RowhBottom*(2*(gNumberofRows - 1)) + 2*ColhRight;
			IndexRightVertical = newSelectedLine + (2*(gNumberofRows - 1));
			if (gLines[IndexTopHorizontal].capturedLine && 
				gLines[IndexBottomHorizontal].capturedLine && 
				gLines[IndexRightVertical].capturedLine)
			{
				//Insert the Center of a complete square into the array
				output[output.length] = new point(gLines[newSelectedLine].x2, (gLines[newSelectedLine].y1 + gLines[newSelectedLine].y2)/2 - gWidthBetweenEachDot/2);
			}
		}

		if (Colv > 0)
		{
			//Check left
			RowhTop = Rowv;
			RowhBottom = Rowv + 1;
			ColhRight = Colv - 1;

			IndexTopHorizontal = RowhTop*(2*(gNumberofRows - 1)) + 2*ColhRight;
			IndexBottomHorizontal = RowhBottom*(2*(gNumberofRows - 1)) + 2*ColhRight;
			IndexRightVertical = newSelectedLine - (2*(gNumberofRows - 1));
			if (gLines[IndexTopHorizontal].capturedLine && 
				gLines[IndexBottomHorizontal].capturedLine && 
				gLines[IndexRightVertical].capturedLine)
			{
				//Insert the Center of a complete square into the array
				output[output.length] = new point(gLines[newSelectedLine].x2 - gWidthBetweenEachDot, (gLines[newSelectedLine].y1 + gLines[newSelectedLine].y2)/2 - gWidthBetweenEachDot/2);
			}
		}
	}
	return output;
}

function createSquares(indexOfSelectedLine) 
{
	var SquaresCenters = checkForCompleteSquares(indexOfSelectedLine);
	var wonAsquare = false;
	for (var i = 0; i < SquaresCenters.length; i++)
	{
		var rect = new Kinetic.Rect({
			x: SquaresCenters[i].x,
			y: SquaresCenters[i].y,
			width: gWidthBetweenEachDot,
			height: gWidthBetweenEachDot,
			fill: currentPlayer.color,
		});

		var simpleText = new Kinetic.Text({
            x: rect.getX(),
            y: rect.getY() + gWidthBetweenEachDot/2 - 32,
            text: currentPlayer.name.charAt(0),
            fontSize: 60,
            fontFamily: "Calibri",
            width:rect.getWidth() ,
            align: "center",    
            fill: "white"
        });
        gLayer.add(simpleText);
		gLayer.add(rect);
		simpleText.moveToBottom();
		rect.moveToBottom();
		gLayer.draw();

		//also increment score
		currentPlayer.score++;
		wonAsquare = true;
	}
	displayScore();
	return wonAsquare;
}

function dot(x, y) {
	/*jshint validthis: true */
   this.x = x;
   this.y = y;
   this.OutputShape = new Kinetic.Circle({
   	x: this.x,
   	y: this.y,
   	radius: 10,
   	fill: "#DDDDDD"
   });
   this.OutputShape.on("mouseover", function() {
   	this.fill("#AAAAAA");
   	gLayer.draw();
   });
   this.OutputShape.on("mouseout", function() {
   	this.fill("#DDDDDD");
   	gLayer.draw();
   });
   this.draw = function() {
   	gLayer.add(this.OutputShape);
   	this.OutputShape.moveToTop();
   };
}

function line(x1, y1, x2, y2) {
	/*jshint validthis: true */
   this.x1 = x1;
   this.y1 = y1;
   this.x2 = x2;
   this.y2 = y2;
   this.capturedLine = false;
   this.color = "#AAAAAA";
   var LineVar = this;

   this.reset = function () {
   	this.color = "#AAAAAA";
   	this.capturedLine = false;
   };
   this.OutputShape = new Kinetic.Line({
   	points: [this.x1, this.y1, this.x2, this.y2],
   	stroke: this.color,
   	strokeWidth: 5,
   	lineCap: "round",
   });

   //Hover effect
   this.OutputShape.on("mouseover", function() {
   	this.stroke(currentPlayer.color);
   	gLayer.draw();
   });
   this.OutputShape.on("mouseout", function() {
   	this.stroke(LineVar.color);
   	gLayer.draw();
   });
   //Click event
   this.OutputShape.on("click", function() {
   	if (!LineVar.capturedLine)
   	{
	   	LineVar.capturedLine = true;
	   	LineVar.color = currentPlayer.color;
	   	var index = gLines.indexOf(LineVar);
	   	if (!createSquares(index))
	   	{
	   		changePlayer();
	   	}
   	}
   });
   this.draw = function() {
   	gLayer.add(this.OutputShape);
   	this.OutputShape.moveToBottom();
   };
}

function newgame() {
	initGrid();
	initPlayers();
	currentPlayer = players[0];
	populateSettings();
	displayScore();
}

function initPlayers() {
	while (players.length < gNumberofPlayers)
	{
		players.push(new player("Player " + (players.length).toString(), colors[players.length]));
	}
}

function popPlayers() {
	while (players.length > gNumberofPlayers)
	{
		players.pop();
	}
}

function resetBoard() {
	//Reset all lines to blank
	for (var i = 0; i < gLines.length; i++)
	{
		gLines[i].reset();
	}
	gLayer.draw();
	populateSettings();
	displayScore();
}

function initKinetic() {
	gStage = new Kinetic.Stage({container: "container", width: gBoardWidth, height: gBoardWidth});
	gLayer = new Kinetic.Layer();
}

/*exported initgame */
function initgame() {
	initKinetic();
	gPlayerScoresDiv = document.getElementById("PlayerInfo");
	gPlayerNamesDiv = document.getElementById("playerNameSettings");
	gGridSizeDiv = document.getElementById("gridSize");
	gNumberofPlayersDiv = document.getElementById("NumberofPlayers");
	newgame();
	gStage.add(gLayer);
}

function reInitGame() {
	gLayer = new Kinetic.Layer();
	gStage.add(gLayer);
	initGrid();
	currentPlayer = players[0];
	displayScore();
}

function initGrid() {
	var prevX = gWidthBetweenEachDot/2;
	var prevY = gWidthBetweenEachDot/2;
	var h, w;
	for (h = prevY; h < gBoardWidth; h += gWidthBetweenEachDot)
	{
		for (w = gWidthBetweenEachDot + gWidthBetweenEachDot/2; w < gBoardWidth; w += gWidthBetweenEachDot)
		{
			gLines[gLines.length] = new line(prevX, prevY, w, h);
			gLines[gLines.length - 1].draw();
			gLines[gLines.length] = new line(prevY, prevX, h, w);
			gLines[gLines.length - 1].draw();
			prevX = w;
		}
		prevY += gWidthBetweenEachDot;
		prevX = gWidthBetweenEachDot/2;
	}
	//Draw the initial dots
	for (w = 0; w < gBoardWidth; w += gWidthBetweenEachDot) { 
		for (h = 0; h < gBoardWidth; h += gWidthBetweenEachDot) { 
			gDots[gDots.length] = new dot(w + gWidthBetweenEachDot/2, h + gWidthBetweenEachDot/2);
			gDots[gDots.length - 1].draw();
		}
	}
}
function destroygrid() {
	//Delete all lines
	while (gLines.length > 0)
	{
		gLines.pop();
	}

	//Delete all dots
	while (gDots.length > 0)
	{
		gDots.pop();
	}
	gLayer.destroy();
	gStage.destroy();
}

/*exported saveSettings */
function saveSettings(playerNames, gridSize, NewNumberOfPlayers) {
	if (gridSize != gNumberofRows)
	{
		gNumberofRows = gridSize;
		gBoardWidth = gNumberofRows * gWidthBetweenEachDot;
		destroygrid();
		initKinetic();
		reInitGame();
	}

	//Add or decrease number of players
	if (NewNumberOfPlayers != gNumberofPlayers)
	{
		if (!isNaN(Number(NewNumberOfPlayers)) && Number(NewNumberOfPlayers) <= gMaxNumberOfPlayers)
		{
			if (NewNumberOfPlayers < gNumberofPlayers)
			{
				gNumberofPlayers = Number(NewNumberOfPlayers);
				popPlayers();
			}
			else
			{
				gNumberofPlayers = Number(NewNumberOfPlayers);
				initPlayers();
			}
		}
	}

	for (var i = 0; i < Math.min(playerNames.length, gNumberofPlayers) ; i++)
	{
		players[i].name = playerNames[i];
		players[i].reset();
	}

	resetBoard();
}