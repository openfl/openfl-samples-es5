var Application = require ("openfl/display/Application").default;
var Main = require ("./Main").default;

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
stage.addChild (new Main ());