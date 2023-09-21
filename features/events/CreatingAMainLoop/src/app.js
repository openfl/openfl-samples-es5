"use strict";
var Sprite = require ("openfl/display/Sprite").default;
var Stage = require ("openfl/display/Stage").default;
var Event = require ("openfl/events/Event").default;
var Lib = require ("openfl/Lib").default;


var App = function () {
	
	Sprite.call (this);
	
	this.sprite = new Sprite ();
	this.sprite.graphics.beginFill (0x24AFC4);
	this.sprite.graphics.drawRect (0, 0, 100, 100);
	this.sprite.y = 50;
	this.addChild (this.sprite);
	
	this.speed = 0.3;
	this.cacheTime = Lib.getTimer ();
	
	this.addEventListener (Event.ENTER_FRAME, this.this_onEnterFrame.bind (this));
	
}

App.prototype = Sprite.prototype;


App.prototype.update = function (deltaTime) {
	
	if (this.sprite.x + this.sprite.width >= this.stage.stageWidth || this.sprite.x < 0) {
		
		this.speed *= -1;
		
	}
	
	this.sprite.x += this.speed * deltaTime;
	
}




// Event Handlers




App.prototype.this_onEnterFrame = function (event) {
	
	var currentTime = Lib.getTimer ();
	this.update (currentTime - this.cacheTime);
	this.cacheTime = currentTime;
	
}


var stage = new Stage (550, 400, 0xFFFFFF, App);
document.body.appendChild (stage.element);