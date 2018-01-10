"use strict";
var MovieClip = require ("openfl/display/MovieClip").default;
var Sprite = require ("openfl/display/Sprite").default;
var Stage = require ("openfl/display/Stage").default;
var Event = require ("openfl/events/Event").default;
var AssetLibrary = require ("openfl/utils/AssetLibrary").default;
var layoutPath = require ("./../assets/layout.swf");


var App = function () {
	
	Sprite.call (this);
	
	AssetLibrary.loadFromFile (layoutPath).onComplete (function (library) {
		
		this.layout = library.getMovieClip ("Layout");
		this.addChild (this.layout);
		
		this.columnOffsetHeight = (this.layout["Column"].height - this.layout.height);
		this.headerOffsetWidth = (this.layout["Header"].width - this.layout.width);
		
		this.resize ();
		this.stage.addEventListener (Event.RESIZE, this.resize.bind (this));
		
	}.bind (this));
	
}

App.prototype = Sprite.prototype;


App.prototype.resize = function (event = null) {
	
	this.layout.Background.width = this.stage.stageWidth;
	this.layout.Background.height = this.stage.stageHeight;
	
	var columnHeight = this.stage.stageHeight + this.columnOffsetHeight;
	this.layout.Column.height = (columnHeight > 0 ? columnHeight : 0);
	
	var headerWidth = this.stage.stageWidth + this.headerOffsetWidth;
	this.layout.Header.width = (headerWidth > 0 ? headerWidth : 0);
	
}


var stage = new Stage (0, 0, 0xFFFFFF, App);
document.body.appendChild (stage.element);