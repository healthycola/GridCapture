var gStage;
var gLayer;
var gNumberofRows = 5;
var gWidthBetweenEachDot = 80;
var gBoardWidth = gNumberofRows * gWidthBetweenEachDot;

var gDots = new Array();
var gLines = new Array();

function dot(x, y) {
   this.x = x;
   this.y = y;
   this.OutputShape = new Kinetic.Circle({
   	x: this.x,
   	y: this.y,
   	radius: 10,
   	fill: "#DDDDDD"
   });
   this.draw = function() {
   	gLayer.add(this.OutputShape);
   }
};

function line(x1, y1, x2, y2) {
   this.x1 = x1;
   this.y1 = y1;
   this.x2 = x2;
   this.y2 = y2;
   this.OutputShape = new Kinetic.Line({
   	points: [this.x1, this.y1, this.x2, this.y2],
   	stroke: "#AAAAAA",
   	strokeWidth: 5,
   	lineCap: 'round'
   });
   this.draw = function() {
   	gLayer.add(this.OutputShape);
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