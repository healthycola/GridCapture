var gCanvasElement;
var gDrawingContext;
var gNumberofRows = 5;
var gWidthBetweenEachDot = 80;
var gBoardWidth = gNumberofRows * gWidthBetweenEachDot;

var gDots = new Array();
var gLines = new Array();

function dot(x, y) {
   this.x = x;
   this.y = y;
   this.draw = function(ctx) {
   	ctx.fillStyle = "#DDDDDD";
   	ctx.beginPath();
   	ctx.arc(this.x,this.y,10,0,2*Math.PI);
   	ctx.fill()
   	ctx.closePath();
   }
};

function line(x1, y1, x2, y2) {
   this.x1 = x1;
   this.y1 = y1;
   this.x2 = x2;
   this.y2 = y2;

   this.draw = function(ctx) {
   	ctx.strokeStyle = "#777777";
   	ctx.beginPath();
   	ctx.moveTo(this.x1, this.y1);
   	ctx.lineTo(this.x2, this.y2);
   	ctx.lineWidth = 10;
   	ctx.stroke();
   	ctx.closePath();
   }
};

function newgame() {
	var prevX = prevY = gWidthBetweenEachDot/2;
	for (h = prevY; h < gBoardWidth; h += gWidthBetweenEachDot)
	{
		for (w = gWidthBetweenEachDot + gWidthBetweenEachDot/2; w < gBoardWidth; w += gWidthBetweenEachDot)
		{
			gLines[gLines.length] = new line(prevX, prevY, w, h);
			gLines[gLines.length - 1].draw(gDrawingContext);
			gLines[gLines.length] = new line(prevY, prevX, h, w);
			gLines[gLines.length - 1].draw(gDrawingContext);
			prevX = w;
		}
		prevY += gWidthBetweenEachDot;
		prevX = gWidthBetweenEachDot/2;
	}
	//Draw the initial dots
	for (w = 0; w < gBoardWidth; w += gWidthBetweenEachDot) { 
		for (h = 0; h < gBoardWidth; h += gWidthBetweenEachDot) { 
			gDots[gDots.length] = new dot(w + gWidthBetweenEachDot/2, h + gWidthBetweenEachDot/2);
			gDots[gDots.length - 1].draw(gDrawingContext);
		}
	}
}


function initgame(canvasID) {
	gCanvasElement = document.getElementById(canvasID);
	gDrawingContext = gCanvasElement.getContext("2d");
	imageSmoothingEnabled = true;
	gCanvasElement.width = gCanvasElement.height = gBoardWidth;
	newgame();
}