var gStage;
var gLayer;
var gPlayerDiv;
var gPlayerNamesDiv;
var gGridSizeDiv;
var gNumberofRows = 5;
var gMaxNumberOfPlayers = 3;	//if you change this, change var colors[] also.
var gNumberofPlayers = 3;
var gWidthBetweenEachDot = 80;
var gBoardWidth = gNumberofRows * gWidthBetweenEachDot;

var gDots = new Array();
var gLines = new Array();

var players = new Array();
var currentPlayer;

//Should be as long as max number of players, at least.
var colors = [ "#854646", "#465085", "#F0CA05" ];
function player(name, color) {
	this.name = name;
	this.color = color;
	this.score = 0;

	this.reset = function () {
		this.score = 0;
	}
}

function poplateSettings() {
	var infoString = "";
	for (i = 0; i < gNumberofPlayers; i++)
	{
		infoString = infoString + "<span id=\"player" + i + "name\" onclick=\"exchange(this.id)\">Player " + i + " Name</span><input id=\"player" + i + "nameb\" class=\"replace\" type=\"text\" value= \"Player " + i + " Name\" style=\"display:none\"\><br>";
	}
	gPlayerNamesDiv.innerHTML = infoString;
	gGridSizeDiv.innerHTML = "<span id=\"gridSz\" onclick=\"exchange(this.id)\">" + gNumberofRows + "</span><input id=\"gridSzb\" class=\"replace\" type=\"text\" value= \"" + gNumberofRows + "\" style=\"display:none\"\><br>";
}
function point(x,y) {
	this.x = x;
	this.y = y;
}

function DisplayScore()
{
	var infoString = "";
	for (i = 0; i < players.length; i++)
	{
		infoString = infoString + "<span style='color:" + players[i].color +  "'>" + players[i].name + ": " + players[i].score + "</span><p>";
	}
	gPlayerDiv.innerHTML = infoString;
}

function changePlayer()
{
	var currentIndex = players.indexOf(currentPlayer);
	currentPlayer = (currentIndex == players.length - 1) ? players[0] : players[currentIndex + 1];
}

function checkForCompleteSquares(newSelectedLine)
{
	//If the line is horizontal, then check up and down 
	var output = new Array();
	if (newSelectedLine % 2 == 0)
	{
		var Rowh = Math.floor(newSelectedLine/(2*(gNumberofRows - 1)));
		var Colh = (newSelectedLine % (2*(gNumberofRows - 1))) / 2;
		//If the line is at the top row, then we only have to check the box underneath
		if (Rowh < gNumberofRows - 1)
		{
			//Check the row below
			var Rowv = Rowh;
			var ColvLeft = Colh;
			var ColvRight = Colh + 1;

			var IndexLeftVertical = (Rowv*2 + 1) + (2*(gNumberofRows - 1)) * ColvLeft;
			var IndexRightVertical = (Rowv*2 + 1) + (2*(gNumberofRows - 1)) * ColvRight;
			var IndexBottomHorizontal = newSelectedLine + (2*(gNumberofRows - 1));
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
			var Rowv = Rowh - 1;
			var ColvLeft = Colh;
			var ColvRight = Colh + 1;

			var IndexLeftVertical = (Rowv*2 + 1) + (2*(gNumberofRows - 1)) * ColvLeft;
			var IndexRightVertical = (Rowv*2 + 1) + (2*(gNumberofRows - 1)) * ColvRight;
			var IndexUpHorizontal = newSelectedLine - (2*(gNumberofRows - 1));
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
		var Rowv = Math.floor(((newSelectedLine) % (2*(gNumberofRows - 1))) / 2);
		var Colv = Math.floor((newSelectedLine) / (2 * (gNumberofRows - 1)));

		if (Colv < gNumberofRows - 1)
		{
			//Check right
			var RowhTop = Rowv;
			var RowhBottom = Rowv + 1;
			var ColhRight = Colv;

			var IndexTopHorizontal = RowhTop*(2*(gNumberofRows - 1)) + 2*ColhRight;
			var IndexBottomHorizontal = RowhBottom*(2*(gNumberofRows - 1)) + 2*ColhRight;
			var IndexRightVertical = newSelectedLine + (2*(gNumberofRows - 1));
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
			var RowhTop = Rowv;
			var RowhBottom = Rowv + 1;
			var ColhRight = Colv - 1;

			var IndexTopHorizontal = RowhTop*(2*(gNumberofRows - 1)) + 2*ColhRight;
			var IndexBottomHorizontal = RowhBottom*(2*(gNumberofRows - 1)) + 2*ColhRight;
			var IndexRightVertical = newSelectedLine - (2*(gNumberofRows - 1));
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
	for (i = 0; i < SquaresCenters.length; i++)
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
            fontFamily: 'Calibri',
            width:rect.getWidth() ,
            align: 'center',    
            fill: 'white'
        });
        gLayer.add(simpleText);
		gLayer.add(rect);
		simpleText.moveToBottom();
		rect.moveToBottom();
		gLayer.draw();

		//also increment score
		currentPlayer.score++;
		DisplayScore();
		wonAsquare = true;
	}
	return wonAsquare;
}

function dot(x, y) {
   this.x = x;
   this.y = y;
   this.OutputShape = new Kinetic.Circle({
   	x: this.x,
   	y: this.y,
   	radius: 10,
   	fill: "#DDDDDD"
   });
   this.OutputShape.on('mouseover', function() {
   	this.fill("#AAAAAA");
   	gLayer.draw();
   });
   this.OutputShape.on('mouseout', function() {
   	this.fill("#DDDDDD");
   	gLayer.draw();
   });
   this.draw = function() {
   	gLayer.add(this.OutputShape);
   	this.OutputShape.moveToTop();
   }
};

function line(x1, y1, x2, y2) {
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
   }
   this.OutputShape = new Kinetic.Line({
   	points: [this.x1, this.y1, this.x2, this.y2],
   	stroke: this.color,
   	strokeWidth: 5,
   	lineCap: 'round',
   });

   //Hover effect
   this.OutputShape.on('mouseover', function() {
   	this.stroke(currentPlayer.color);
   	gLayer.draw();
   });
   this.OutputShape.on('mouseout', function() {
   	this.stroke(LineVar.color);
   	gLayer.draw();
   });
   //Click event
   this.OutputShape.on('click', function() {
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
   }
};

function newgame() {
	initGrid();
	for (i = 0; i < gNumberofPlayers; i++)
	{
		players[i] = new player(i.toString(), colors[i]);
	}
	currentPlayer = players[0];
	poplateSettings();
	DisplayScore();
}

function resetBoard() {
	//Reset all lines to blank
	for (i = 0; i < gLines.length; i++)
	{
		gLines[i].reset();
	}
	gLayer.draw();
	DisplayScore();
}

function initKinetic() {
	gStage = new Kinetic.Stage({container: 'container', width: gBoardWidth, height: gBoardWidth});
	gLayer = new Kinetic.Layer();
}

function initgame(canvasID) {
	initKinetic();
	gPlayerDiv = document.getElementById("PlayerInfo");
	gPlayerNamesDiv = document.getElementById("playerNameSettings");
	gGridSizeDiv = document.getElementById("gridSize");

	newgame();
	gStage.add(gLayer);
}

function reInitGame() {
	gLayer = new Kinetic.Layer();
	gStage.add(gLayer);
	initGrid();
	currentPlayer = players[0];
	DisplayScore();
	console.log(gLines);
}

function initGrid() {
	var prevX = prevY = gWidthBetweenEachDot/2;
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

function saveSettings(playerNames, gridSize) {
	for (i = 0; i < gNumberofPlayers; i++)
	{
		players[i].name = playerNames[i];
		players[i].reset();
	}
	if (gridSize != gNumberofRows)
	{
		gNumberofRows = gridSize;
		gBoardWidth = gNumberofRows * gWidthBetweenEachDot;
		destroygrid();
		initKinetic();
		reInitGame();
	}

	resetBoard();
}