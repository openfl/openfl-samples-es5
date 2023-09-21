"use strict";
var Quad = require ("motion/easing/Quad").default;
var Actuate = require ("motion/Actuate").default;
var Sprite = require ("openfl/display/Sprite").default;
var Stage = require ("openfl/display/Stage").default;
var Event = require ("openfl/events/Event").default;
var MouseEvent = require ("openfl/events/MouseEvent").default;
var Sound = require ("openfl/media/Sound").default;
var SoundChannel = require ("openfl/media/SoundChannel").default;
var SoundTransform = require ("openfl/media/SoundTransform").default;
var AssetLibrary = require ("openfl/utils/AssetLibrary").default;
var AssetManifest = require ("openfl/utils/AssetManifest").default;
var Assets = require ("openfl/utils/Assets").default;


var App = function () {
	
	Sprite.call (this);
	
	Actuate.defaultEase = Quad.easeOut;
	
	this.background = new Sprite ();
	this.background.alpha = 0.1;
	this.background.buttonMode = true;
	this.background.addEventListener (MouseEvent.MOUSE_DOWN, this.this_onMouseDown.bind (this));
	this.addChild (this.background);
	
	this.sound = Assets.getSound ("assets/stars.ogg");
	this.position = 0;
	
	this.resize ();
	this.stage.addEventListener (Event.RESIZE, this.stage_onResize.bind (this));
	
	this.play ();
	
}

App.prototype = Sprite.prototype;


App.prototype.pause = function (fadeOut = 1.2) {
	
	if (this.playing) {
		
		this.playing = false;
		
		Actuate.transform (this.channel, fadeOut).sound (0, 0).onComplete (this.stop);
		Actuate.tween (this.background, fadeOut, { alpha: 0.1 });
		
	}
	
}


App.prototype.play = function (fadeIn = 3) {
	
	this.stop ();
	
	this.playing = true;
	
	if (fadeIn <= 0) {
		
		this.channel = this.sound.play (this.position);
		
	} else {
		
		this.channel = this.sound.play (this.position, 0, new SoundTransform (0, 0));
		Actuate.transform (this.channel, fadeIn).sound (1, 0);
		
	}
	
	this.channel.addEventListener (Event.SOUND_COMPLETE, this.channel_onSoundComplete);
	Actuate.tween (this.background, fadeIn, { alpha: 1 });
	
}


App.prototype.resize = function () {
	
	this.background.graphics.clear ();
	this.background.graphics.beginFill (0x24afc4);
	this.background.graphics.drawRect (0, 0, this.stage.stageWidth, this.stage.stageHeight);
	
}


App.prototype.stop = function () {
	
	this.playing = false;
	
	Actuate.stop (this.channel);
	
	if (this.channel != null) {
		
		this.position = this.channel.position;
		this.channel.removeEventListener (Event.SOUND_COMPLETE, this.channel_onSoundComplete);
		this.channel.stop ();
		this.channel = null;
		
	}
	
}




// Event Handlers




App.prototype.channel_onSoundComplete = function (event) {
	
	this.pause ();
	this.position = 0;
	
}


App.prototype.stage_onResize = function (event) {
	
	this.resize ();
	
}


App.prototype.this_onMouseDown = function (event) {
	
	if (!this.playing) {
		
		this.play ();
		
	} else {
		
		this.pause ();
		
	}
	
}


var manifest = new AssetManifest ();
manifest.addSound ([ "assets/stars.ogg", "assets/stars.mp3" ]);

AssetLibrary.loadFromManifest (manifest).onComplete (function (library) {
	
	Assets.registerLibrary ("default", library);
	
	var stage = new Stage (550, 400, 0xFFFFFF, App);
	document.body.appendChild (stage.element);
	
}).onError (function (e) {
	
	console.error (e);
	
});