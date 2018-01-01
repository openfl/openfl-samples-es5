var Stage = require ("openfl/display/Stage").default;
var Main = require ("./Main").default;

var stage = new Stage (550, 400);
document.body.appendChild (stage.element);
stage.addChild (new Main ());