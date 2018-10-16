"use strict";
var Actuate = require ("motion/Actuate").default;
var Sprite = require ("openfl/display/Sprite").default;
var Stage = require ("openfl/display/Stage").default;
var AsyncErrorEvent = require ("openfl/events/AsyncErrorEvent").default;
var MouseEvent = require ("openfl/events/MouseEvent").default;
var NetStatusEvent = require ("openfl/events/NetStatusEvent").default;
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
	
	this.overlay = new Sprite ();
	this.overlay.graphics.beginFill (0, 0.5);
	this.overlay.graphics.drawRect (0, 0, 560, 320);
	this.overlay.addEventListener (MouseEvent.MOUSE_DOWN, this.overlay_onMouseDown.bind (this));
	this.addChild (this.overlay);
	
	netConnection.addEventListener (NetStatusEvent.NET_STATUS, this.netConnection_onNetStatus.bind (this));
	
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


App.prototype.netConnection_onNetStatus = function (event) {
		
	if (event.info.code == "NetStream.Play.Complete") {
		
		Actuate.tween (this.overlay, 1, { alpha: 1 });
		
	}
	
}


App.prototype.overlay_onMouseDown = function (event) {
	
	Actuate.tween (this.overlay, 2, { alpha: 0 });
	this.netStream.play ("assets/example.mp4");
	
}


var stage = new Stage (550, 400, 0xFFFFFF, App);
document.body.appendChild (stage.element);