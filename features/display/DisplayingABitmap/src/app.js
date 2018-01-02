var Loader = require ("openfl/display/Loader").default;
var Sprite = require ("openfl/display/Sprite").default;
var Stage = require ("openfl/display/Stage").default;
var URLRequest = require ("openfl/net/URLRequest").default;
var Event = require ("openfl/events/Event").default;

var stage = new Stage (550, 400);
document.body.appendChild (stage.element);

var Main = function () {
	
	Sprite.call (this);
	
	var loader = new Loader ();
	loader.contentLoaderInfo.addEventListener (Event.COMPLETE, function (event) {
		var bitmap = loader.content;
		bitmap.x = (stage.stageWidth - bitmap.width) / 2;
		bitmap.y = (stage.stageHeight - bitmap.height) / 2;
	});
	loader.load (new URLRequest ("openfl.png"));
	
	stage.addChild (loader);
	
}

Main.prototype = Sprite.prototype;
stage.addChild (new Main ());