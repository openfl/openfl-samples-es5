"use strict";
var Elastic = require ("motion/easing/Elastic").default;
var Actuate = require ("motion/Actuate").default;
var Bitmap = require ("openfl/display/Bitmap").default;
var Sprite = require ("openfl/display/Sprite").default;
var Stage = require ("openfl/display/Stage").default;
var AssetLibrary = require ("openfl/utils/AssetLibrary").default;
var AssetManifest = require ("openfl/utils/AssetManifest").default;
var Assets = require ("openfl/utils/Assets").default;


var App = function () {
	
	Sprite.call (this);
	
	var bitmap = new Bitmap (Assets.getBitmapData ("assets/openfl.png"));
	bitmap.x = -bitmap.width / 2;
	bitmap.y = -bitmap.height / 2;
	bitmap.smoothing = true;
	
	var container = new Sprite ();
	container.addChild (bitmap);
	container.alpha = 0;
	container.scaleX = 0;
	container.scaleY = 0;
	container.x = this.stage.stageWidth / 2;
	container.y = this.stage.stageHeight / 2;
	
	this.addChild (container);
	
	Actuate.tween (container, 3, { alpha: 1 });
	Actuate.tween (container, 6, { scaleX: 1, scaleY: 1 }).delay (0.4).ease (Elastic.easeOut);
	
}

App.prototype = Sprite.prototype;


var manifest = new AssetManifest ();
manifest.addBitmapData ("assets/openfl.png");

AssetLibrary.loadFromManifest (manifest).onComplete (function (library) {
	
	Assets.registerLibrary ("default", library);
	
	var stage = new Stage (550, 400, 0xFFFFFF, App);
	document.body.appendChild (stage.element);
	
}).onError (function (e) {
	
	console.error (e);
	
});