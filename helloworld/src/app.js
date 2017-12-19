var BitmapData = require ("openfl/display/BitmapData").default;
var Rectangle = require ("openfl/geom/Rectangle").default;

var bitmapData = new BitmapData (200, 200, true, 0xFF24AFC4);

var rect = new Rectangle (50, 50, 100, 100);
bitmapData.fillRect (rect, 0xFFCCCCCC);

document.body.appendChild (bitmapData.image.src);
console.log ("Hello World");