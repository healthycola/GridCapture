var gStage;
var gLayer;
var gNumberofRows = 5;
var gWidthBetweenEachDot = 80;
var gBoardWidth = gNumberofRows * gWidthBetweenEachDot;

var gDots = new Array();
var gLines = new Array();

function point(x,y) {
	this.x = x;
	this.y = y;
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
	console.log(SquaresCenters);
	for (i = 0; i < SquaresCenters.length; i++)
	{
		var rect = new Kinetic.Rect({
			x: SquaresCenters[i].x,
			y: SquaresCenters[i].y,
			width: gWidthBetweenEachDot,
			height: gWidthBetweenEachDot,
			fill: 'red',
		});
		gLayer.add(rect);
		rect.moveToBottom();
		gLayer.draw();
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
   this.OutputShape = new Kinetic.Line({
   	points: [this.x1, this.y1, this.x2, this.y2],
   	stroke: "#AAAAAA",
   	strokeWidth: 5,
   	lineCap: 'round',
   });
   //Hover effect
   this.OutputShape.on('mouseover', function() {
   	this.stroke("#555555");
   	gLayer.draw();
   });
   this.OutputShape.on('mouseout', function() {
   	this.stroke("#AAAAAA");
   	gLayer.draw();
   });

   var LineVar = this;
   //Click event
   this.OutputShape.on('click', function() {
   	LineVar.capturedLine = true;
   	var index = gLines.indexOf(LineVar);
   	createSquares(index);
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
}


function initgame(canvasID) {
	gStage = new Kinetic.Stage({container: 'container', width: gBoardWidth, height: gBoardWidth});
	gLayer = new Kinetic.Layer();
	newgame();
	gStage.add(gLayer);
}