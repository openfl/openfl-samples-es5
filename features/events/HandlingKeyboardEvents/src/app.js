var Bitmap = require ("openfl/display/Bitmap").default;
var Sprite = require ("openfl/display/Sprite").default;
var Stage = require ("openfl/display/Stage").default;
var Event = require ("openfl/events/Event").default;
var KeyboardEvent = require ("openfl/events/KeyboardEvent").default;
var Keyboard = require ("openfl/ui/Keyboard").default;
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
	this.addChild (this.Logo);
	
	this.stage.addEventListener (KeyboardEvent.KEY_DOWN, this.stage_onKeyDown.bind (this));
	this.stage.addEventListener (KeyboardEvent.KEY_UP, this.stage_onKeyUp.bind (this));
	this.stage.addEventListener (Event.ENTER_FRAME, this.this_onEnterFrame.bind (this));
	
}

App.prototype = Sprite.prototype;




// Event Handlers




App.prototype.stage_onKeyDown = function (event) {
	
	var preventDefault = true;
	
	switch (event.keyCode) {
		
		case Keyboard.DOWN: this.movingDown = true; break;
		case Keyboard.LEFT: this.movingLeft = true; break;
		case Keyboard.RIGHT: this.movingRight = true; break;
		case Keyboard.UP: this.movingUp = true; break;
		default: preventDefault = false;
		
	}
	
	if (preventDefault) event.preventDefault ();
	
}


App.prototype.stage_onKeyUp = function (event) {
	
	var preventDefault = true;
	
	switch (event.keyCode) {
		
		case Keyboard.DOWN: this.movingDown = false; break;
		case Keyboard.LEFT: this.movingLeft = false; break;
		case Keyboard.RIGHT: this.movingRight = false; break;
		case Keyboard.UP: this.movingUp = false; break;
		default: preventDefault = false;
		
	}
	
	if (preventDefault) event.preventDefault ();
	
}


App.prototype.this_onEnterFrame = function (event) {
	
	if (this.movingDown) {
		
		this.Logo.y += 5;
		
	}
	
	if (this.movingLeft) {
		
		this.Logo.x -= 5;
		
	}
	
	if (this.movingRight) {
		
		this.Logo.x += 5;
		
	}
	
	if (this.movingUp) {
		
		this.Logo.y -= 5;
		
	}
	
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