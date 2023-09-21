"use strict";
var Sprite = require ("openfl/display/Sprite").default;
var Stage = require ("openfl/display/Stage").default;
var Event = require ("openfl/events/Event").default;
var CustomEvent = require ("./customEvent").default;


var App = function () {
	
	Sprite.call (this);
	
	this.addEventListener ("simpleCustomEvent", this.this_onSimpleCustomEvent.bind (this));
	this.addEventListener (CustomEvent.TYPED_CUSTOM_EVENT, this.this_onTypedCustomEvent.bind (this));
	
	this.dispatchEvent (new Event ("simpleCustomEvent"));
	this.dispatchEvent (new CustomEvent (CustomEvent.TYPED_CUSTOM_EVENT, 100));
	
}

App.prototype = Sprite.prototype;




// Event Handlers




App.prototype.this_onSimpleCustomEvent = function (event) {
	
	console.log (event);
	
}


App.prototype.this_onTypedCustomEvent = function (event) {
	
	console.log (event);
	
}


var stage = new Stage (550, 400, 0xFFFFFF, App);
document.body.appendChild (stage.element);