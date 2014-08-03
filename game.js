var gStage;
var gLayer;
var gPlayerDiv, gCurrentTurnDiv;
var gNumberofRows = 10;
var gWidthBetweenEachDot = 80;
var gBoardWidth = gNumberofRows * gWidthBetweenEachDot;

var gDots = new Array();
var gLines = new Array();

var gPlayer1, gPlayer2, currentPlayer;

var gLastTurnWon;

function player(name, color) {
	this.name = name;
	this.color = color;
	this.score = 0;
}

function point(x,y) {
	this.x = x;
	this.y = y;
}

function DisplayScore()
{
	var infoString = "<span style='color:" + gPlayer1.color +  "'>" + gPlayer1.name + ": " + gPlayer1.score + "</span><p>" + 
					 "<span style='color:" + gPlayer2.color +  "'>" + gPlayer2.name + ": " + gPlayer2.score + "</span><p>";
	gPlayerDiv.innerHTML = infoString;
}

function CurrentPlayerDisplay()
{
	gCurrentTurnDiv.innerHTML = "<span style='color:" + currentPlayer.color +  "'>It's " + currentPlayer.name + "\'s turn.</span><p>";
}

function changePlayer()
{
	currentPlayer = (currentPlayer == gPlayer1) ? gPlayer2 : gPlayer1;
}

function gameEnded()
{
	for (i = 0; i < gLines.length; i++)
	{
		if (gLines[i].capturedLine == false)
		{
			return false;
		}
	}
	return true;
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
	if (SquaresCenters.length > 0)
	{
		gLastTurnWon = true;
	}
	else
	{
		gLastTurnWon = false;
	}
	for (i = 0; i < SquaresCenters.length; i++)
	{
		var rect = new Kinetic.Rect({
			x: SquaresCenters[i].x,
			y: SquaresCenters[i].y,
			width: gWidthBetweenEachDot,
			height: gWidthBetweenEachDot,
			fill: "#BBBBBB",
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
	}
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
   this.OutputShape = new Kinetic.Line({
   	points: [this.x1, this.y1, this.x2, this.y2],
   	stroke: this.color,
   	strokeWidth: 5,
   	lineCap: 'round',
   });

   var LineVar = this;
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
	   	createSquares(index);
	   	//only change players if the last player didn't get a point
	   	if (!gLastTurnWon)
	   	{
	   		changePlayer();
	   		CurrentPlayerDisplay();
	   	}
	   	if (gameEnded())
	   	{
	   		var winner = (gPlayer1.score > gPlayer2.score) ? gPlayer1.name : gPlayer2.name;
	   		alert("Congrats " + winner + " on winning!");
	   	}
   	}
   });
   this.draw = function() {
   	gLayer.add(this.OutputShape);
   	this.OutputShape.moveToBottom();
   }
};

function newgame() {
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

	gPlayer1 = new player("Albus", '#993300');
	gPlayer2 = new player("Harry", '#003366');
	currentPlayer = gPlayer1;

	DisplayScore();
	CurrentPlayerDisplay();
}


function initgame(canvasID) {
	gStage = new Kinetic.Stage({container: 'container', width: gBoardWidth, height: gBoardWidth});
	gLayer = new Kinetic.Layer();
	gPlayerDiv = document.getElementById("PlayerInfo");
	gCurrentTurnDiv = document.getElementById("CurrentTurn");
	newgame();
	gStage.add(gLayer);
}