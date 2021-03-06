"use strict";
var Sprite = require ("openfl/display/Sprite").default;
var Stage = require ("openfl/display/Stage").default;
var AssetLibrary = require ("openfl/utils/AssetLibrary").default;
var libraryPath = require ("./../assets/library.swf");


var App = function () {
	
	Sprite.call (this);
	
	AssetLibrary.loadFromFile (libraryPath).onComplete (function (library) {
		
		var cat = library.getMovieClip ("NyanCatAnimation");
		this.addChild (cat);
		
	}.bind (this)).onError (function (e) { console.error (e) });
	
}

App.prototype = Sprite.prototype;


var stage = new Stage (550, 400, 0xFFFFFF, App);
document.body.appendChild (stage.element);