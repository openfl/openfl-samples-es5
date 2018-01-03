var Actuate = require ("motion/Actuate").default;
var Bitmap = require ("openfl/display/Bitmap").default;
var Sprite = require ("openfl/display/Sprite").default;
var Stage = require ("openfl/display/Stage").default;
var MouseEvent = require ("openfl/events/MouseEvent").default;
var AssetLibrary = require ("openfl/utils/AssetLibrary").default;
var AssetManifest = require ("openfl/utils/AssetManifest").default;
var Assets = require ("openfl/utils/Assets").default;


var App = function () {
	
	Sprite.call (this);
	
	this.Logo = new Sprite ();
	this.Logo.addChild (new Bitmap (Assets.getBitmapData ("assets/openfl.png")));
	this.Logo.x = 100;
	this.Logo.y = 100;
	this.Logo.buttonMode = true;
	
	this.Destination = new Sprite ();
	this.Destination.graphics.beginFill (0xF5F5F5);
	this.Destination.graphics.lineStyle (1, 0xCCCCCC);
	this.Destination.graphics.drawRect (0, 0, this.Logo.width + 10, this.Logo.height + 10);
	this.Destination.x = 300;
	this.Destination.y = 95;
	
	this.addChild (this.Destination);
	this.addChild (this.Logo);
	
	this.Logo.addEventListener (MouseEvent.MOUSE_DOWN, this.Logo_onMouseDown.bind (this));
	
}

App.prototype = Sprite.prototype;




// Event Handlers




App.prototype.Logo_onMouseDown = function (event) {
	
	this.cacheOffsetX = this.Logo.x - event.stageX;
	this.cacheOffsetY = this.Logo.y - event.stageY;
	
	this.onMouseMove = this.stage_onMouseMove.bind (this);
	this.onMouseDown = this.stage_onMouseUp.bind (this);
	
	this.stage.addEventListener (MouseEvent.MOUSE_MOVE, this.onMouseMove);
	this.stage.addEventListener (MouseEvent.MOUSE_UP, this.onMouseDown);
	
}


App.prototype.stage_onMouseMove = function (event) {
	
	this.Logo.x = event.stageX + this.cacheOffsetX;
	this.Logo.y = event.stageY + this.cacheOffsetY;
	
}


App.prototype.stage_onMouseUp = function (event) {
	
	if (this.Destination.hitTestPoint (event.stageX, event.stageY)) {
		
		Actuate.tween (this.Logo, 1, { x: this.Destination.x + 5, y: this.Destination.y + 5 } );
		
	}
	
	this.stage.removeEventListener (MouseEvent.MOUSE_MOVE, this.onMouseMove);
	this.stage.removeEventListener (MouseEvent.MOUSE_UP, this.onMouseUp);
	
}


var manifest = new AssetManifest ();
manifest.addBitmapData ("assets/openfl.png");

AssetLibrary.loadFromManifest (manifest).onComplete (function (library) {
	
	Assets.registerLibrary ("default", library);
	
	var stage = new Stage (550, 400, 0xFFFFFF, App);
	document.body.appendChild (stage.element);
	
}).onError (function (e) {
	
	console.error (e);
	
});