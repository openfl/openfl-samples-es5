var Application = require ("openfl/display/Application").default;
var Sprite = require ("openfl/display/Sprite").default;
var Loader = require ("openfl/display/Loader").default;
var URLRequest = require ("openfl/net/URLRequest").default;
var Event = require ("openfl/events/Event").default;

var div = document.createElement ("div");
document.body.appendChild (div);

var app = new Application ();
app.create ({
	windows: [{
		width: 550,
		height: 400,
		element: div
	}]
});
app.exec ();

var stage = app.window.stage;

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