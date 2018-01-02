"use strict";
var Sprite = require ("openfl/display/Sprite").default;
var Stage = require ("openfl/display/Stage").default;
var Font = require ("openfl/text/Font").default;
var TextField = require ("openfl/text/TextField").default;
var TextFormat = require ("openfl/text/TextFormat").default;
var AssetLibrary = require ("openfl/utils/AssetLibrary").default;
var AssetManifest = require ("openfl/utils/AssetManifest").default;


var App = function () {
	
	Sprite.call (this);
	
	var format = new TextFormat ("Katamotz Ikasi", 30, 0x7A0026);
	var textField = new TextField ();
	
	textField.defaultTextFormat = format;
	textField.embedFonts = true;
	textField.selectable = false;
	
	textField.x = 50;
	textField.y = 50;
	textField.width = 200;
	
	textField.text = "Hello World";
	
	this.addChild (textField);
	
}

App.prototype = Sprite.prototype;


var manifest = new AssetManifest ();
manifest.addFont ("Katamotz Ikasi");

AssetLibrary.loadFromManifest (manifest).onComplete (function (library) {
	
	//Assets.registerLibrary ("default", library);
	
	var stage = new Stage (550, 400, 0xFFFFFF, App);
	document.body.appendChild (stage.element);
	
}).onError (function (e) {
	
	console.error (e);
	
});