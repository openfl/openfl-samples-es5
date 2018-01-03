"use strict";
var Event = require ("openfl/events/Event").default;


var CustomEvent = function (type, customData, bubbles = false, cancelable = false) {
	
	Event.call (this, type, bubbles, cancelable);
	
	this.customData = customData;
	
}

CustomEvent.prototype = Event.prototype;
CustomEvent.TYPED_CUSTOM_EVENT = "typedCustomEvent";


CustomEvent.prototype.clone = function () {
	
	return new CustomEvent (this.type, this.customData, this.bubbles, this.cancelable);
	
}


CustomEvent.prototype.toString = function () {
	
	return "[CustomEvent type=\"" + this.type + "\" bubbles=" + this.bubbles + " cancelable=" + this.cancelable + " eventPhase=" + this.eventPhase + " customData=" + this.customData + "]";
	
}


module.exports.CustomEvent = CustomEvent;
module.exports.default = CustomEvent;