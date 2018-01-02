"use strict";
var Sprite = require ("openfl/display/Sprite").default;
var Stage = require ("openfl/display/Stage").default;
var AsyncErrorEvent = require ("openfl/events/AsyncErrorEvent").default;
var Video = require ("openfl/media/Video").default;
var NetConnection = require ("openfl/net/NetConnection").default;
var NetStream = require ("openfl/net/NetStream").default;


var App = function () {
	
	Sprite.call (this);
	
	this.video = new Video ();
	this.addChild (this.video);
	
	var netConnection = new NetConnection ();
	netConnection.connect (null);
	
	this.netStream = new NetStream (netConnection);
	this.netStream.client = { onMetaData: this.client_onMetaData.bind (this) };
	this.netStream.addEventListener (AsyncErrorEvent.ASYNC_ERROR, this.netStream_onAsyncError.bind (this)); 
	this.netStream.play ("assets/example.mp4");
	
}

App.prototype = Sprite.prototype;


App.prototype.client_onMetaData = function (metaData) {
	
	this.video.attachNetStream (this.netStream);
	
	this.video.width = this.video.videoWidth;
	this.video.height = this.video.videoHeight;
	
}


App.prototype.netStream_onAsyncError = function (event) {
	
	console.error ("Error loading video");
	
}


var stage = new Stage (550, 400, 0xFFFFFF, App);
document.body.appendChild (stage.element);