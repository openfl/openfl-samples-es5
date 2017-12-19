var Sprite = require ("openfl/display/Sprite").default;
var Loader = require ("openfl/display/Loader").default;
var URLRequest = require ("openfl/net/URLRequest").default;
var Event = require ("openfl/events/Event").default;
var MouseEvent = require ("openfl/events/MouseEvent").default;
var Tilemap = require ("openfl/display/Tilemap").default;
var Tileset = require ("openfl/display/Tileset").default;
var Tile = require ("openfl/display/Tile").default;

var Main = function () {
	
	Sprite.call (this);
	
	this.bunnies = [];
	this.bunnyID;
	this.addingBunnies = false;
	
	var loader = new Loader ();
	loader.contentLoaderInfo.addEventListener (Event.COMPLETE, function (event) {
		this.start (loader.content.bitmapData);
	}.bind (this));
	loader.load (new URLRequest ("wabbit_alpha.png"));
	
}

Main.prototype = Sprite.prototype;

Main.prototype.start = function (bitmapData) {
	
	this.minX = 0;
	this.maxX = this.stage.stageWidth;
	this.minY = 0;
	this.maxY = this.stage.stageHeight;
	this.gravity = 0.5;
	
	this.tileset = new Tileset (bitmapData);
	this.bunnyID = this.tileset.addRect (bitmapData.rect);
	
	this.tilemap = new Tilemap (this.stage.stageWidth, this.stage.stageHeight, this.tileset);
	this.stage.addChild (this.tilemap);
	
	this.stage.addEventListener (MouseEvent.MOUSE_DOWN, this.stage_onMouseDown.bind (this));
	this.stage.addEventListener (MouseEvent.MOUSE_UP, this.stage_onMouseUp.bind (this));
	this.stage.addEventListener (Event.ENTER_FRAME, this.stage_onEnterFrame.bind (this));
	
	for (var i = 0; i < 10; i++) {
		
		this.addBunny ();
		
	}
	
}

Main.prototype.addBunny = function () {
	
	var bunny = new Tile (this.bunnyID);
	bunny.x = 0;
	bunny.y = 0;
	bunny.speedX = Math.random () * 5;
	bunny.speedY = (Math.random () * 5) - 2.5;
	this.bunnies.push (bunny);
	this.tilemap.addTile (bunny);
	
}

Main.prototype.stage_onEnterFrame = function (event) {
	
	for (var i = 0; i < this.bunnies.length; i++) {
		
		var bunny = this.bunnies[i];
		bunny.x += bunny.speedX;
		bunny.y += bunny.speedY;
		bunny.speedY += this.gravity;
		
		if (bunny.x > this.maxX) {
			
			bunny.speedX *= -1;
			bunny.x = this.maxX;
			
		} else if (bunny.x < this.minX) {
			
			bunny.speedX *= -1;
			bunny.x = this.minX;
			
		}
		
		if (bunny.y > this.maxY) {
			
			bunny.speedY *= -0.8;
			bunny.y = this.maxY;
			
			if (Math.random () > 0.5) {
				
				bunny.speedY -= 3 + Math.random () * 4;
				
			}
			
		} else if (bunny.y < this.minY) {
			
			bunny.speedY = 0;
			bunny.y = this.minY;
			
		}
		
	}
	
	if (this.addingBunnies) {
		
		for (var i = 0; i < 100; i++) {
			
			this.addBunny ();
			
		}
		
	}
	
}

Main.prototype.stage_onMouseDown = function (event) {
	
	this.addingBunnies = true;
	
}

Main.prototype.stage_onMouseUp = function (event) {
	
	this.addingBunnies = false;
	console.log (this.bunnies.length + " bunnies");
	
}

exports.Main = exports.default = Main;