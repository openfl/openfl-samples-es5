"use strict";
var Bitmap = require ("openfl/display/Bitmap").default;
var BitmapData = require ("openfl/display/BitmapData").default;
var BitmapDataChannel = require ("openfl/display/BitmapDataChannel").default;
var Sprite = require ("openfl/display/Sprite").default;
var Stage = require ("openfl/display/Stage").default;
var ColorTransform = require ("openfl/geom/ColorTransform").default;
var Point = require ("openfl/geom/Point").default;
var AssetLibrary = require ("openfl/utils/AssetLibrary").default;
var AssetManifest = require ("openfl/utils/AssetManifest").default;
var Assets = require ("openfl/utils/Assets").default;


var App = function () {
	
	Sprite.call (this);
	
	var image = Assets.getBitmapData ("assets/openfl.png");
	
	var bitmap = new Bitmap (image);
	bitmap.x = 20;
	bitmap.y = 20;
	this.addChild (bitmap);
	
	var bitmap = new Bitmap (image);
	bitmap.x = 130;
	bitmap.y = 120;
	bitmap.rotation = -90;
	this.addChild (bitmap);
	
	var bitmapData = image.clone ();
	bitmapData.colorTransform (bitmapData.rect, new ColorTransform (0.5, 0, 1, 0.5, 20, 0, 0, 0));
	var bitmap = new Bitmap (bitmapData);
	bitmap.x = 240;
	bitmap.y = 20;
	this.addChild (bitmap);
	
	var bitmapData = new BitmapData (image.width, image.height);
	bitmapData.copyPixels (image, image.rect, new Point (-image.width / 2, -image.height / 2));
	bitmapData.copyPixels (image, image.rect, new Point (-image.width / 2, image.height / 2));
	bitmapData.copyPixels (image, image.rect, new Point (image.width / 2, -image.height / 2));
	bitmapData.copyPixels (image, image.rect, new Point (image.width / 2, image.height / 2));
	var bitmap = new Bitmap (bitmapData);
	bitmap.x = 350;
	bitmap.y = 20;
	this.addChild (bitmap);
	
	var bitmapData = new BitmapData (image.width, image.height, true, 0xFFEEEEEE);
	bitmapData.copyPixels (image, image.rect, new Point (), null, null, true);
	var bitmap = new Bitmap (bitmapData);
	bitmap.x = 460;
	bitmap.y = 20;
	this.addChild (bitmap);
	
	var bitmapData = image.clone ();
	bitmapData.copyChannel (image, image.rect, new Point (20, 0), BitmapDataChannel.BLUE, BitmapDataChannel.GREEN);
	var bitmap = new Bitmap (bitmapData);
	bitmap.x = 570;
	bitmap.y = 20;
	this.addChild (bitmap);
	
	var bitmapData = image.clone ();
	bitmapData.floodFill (0, 0, 0xFFEEEEEE);
	var bitmap = new Bitmap (bitmapData);
	bitmap.x = 20;
	bitmap.y = 140;
	this.addChild (bitmap);
	
	var sprite = new Sprite ();
	var bitmap = new Bitmap (image);
	bitmap.scaleX = 2;
	bitmap.alpha = 0.4;
	sprite.addChild (bitmap);
	
	var bitmapData = new BitmapData (image.width, image.height);
	bitmapData.draw (sprite);
	var bitmap = new Bitmap (bitmapData);
	bitmap.x = 130;
	bitmap.y = 140;
	this.addChild (bitmap);
	
	var bitmapData = image.clone ();
	bitmapData.scroll (image.width / 2, 0);
	var bitmap = new Bitmap (bitmapData);
	bitmap.x = 240;
	bitmap.y = 140;
	this.addChild (bitmap);
	
	var bitmapData = image.clone ();
	bitmapData.threshold (image, image.rect, new Point (40, 0), ">", 0x33000000, 0x88333333, 0xFF000000);
	var bitmap = new Bitmap (bitmapData);
	bitmap.x = 350;
	bitmap.y = 140;
	this.addChild (bitmap);
	
}

App.prototype = Sprite.prototype;


var manifest = new AssetManifest ();
manifest.addBitmapData ("assets/openfl.png");

AssetLibrary.loadFromManifest (manifest).onComplete (function (library) {
	
	Assets.registerLibrary ("default", library);
	
	var stage = new Stage (670, 400, 0xFFFFFF, App);
	document.body.appendChild (stage.element);
	
}).onError (function (e) {
	
	console.log (e);
	
});