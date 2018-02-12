'use strict';
var Sprite = require ("openfl/display/Sprite").default;
var Stage = require ("openfl/display/Stage").default;
var Context3D = require ("openfl/display3D/Context3D").default;
var Context3DBlendFactor = require ("openfl/display3D/Context3DBlendFactor").default;
var Context3DProgramType = require ("openfl/display3D/Context3DProgramType").default;
var Context3DVertexBufferFormat = require ("openfl/display3D/Context3DVertexBufferFormat").default;
var IndexBuffer3D = require ("openfl/display3D/IndexBuffer3D").default;
var Program3D = require ("openfl/display3D/Program3D").default;
var VertexBuffer3D = require ("openfl/display3D/VertexBuffer3D").default;
var Event = require ("openfl/events/Event").default;
var Matrix3D = require ("openfl/geom/Matrix3D").default;
var Rectangle = require ("openfl/geom/Rectangle").default;
var Vector3D = require ("openfl/geom/Vector3D").default;
var AGALMiniAssembler = require ("openfl/utils/AGALMiniAssembler").default;
var Lib = require ("openfl/Lib").default;
var Vector = require ("openfl/Vector").default;


var App = function () {
	
	Sprite.call (this);
	
	this.init = this.init.bind (this);
	this.this_onEnterFrame = this.this_onEnterFrame.bind (this);
	
	this.stage.stage3Ds[0].addEventListener (Event.CONTEXT3D_CREATE, this.init);
	this.stage.stage3Ds[0].requestContext3D ();
	
}

App.prototype = Object.create (Sprite.prototype);
App.prototype.constructor = App;


App.prototype.init = function () {
	
	this.context3D = this.stage.stage3Ds[0].context3D;
	this.context3D.configureBackBuffer (this.stage.stageWidth, this.stage.stageHeight, 1, true);
	
	this.context3D.setBlendFactors (Context3DBlendFactor.ONE, Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
	
	var vertices = Vector.ofArray ([
		-0.3, -0.3, 0, 1, 0, 0,
		-0.3, 0.3, 0, 0, 1, 0,
		0.3, 0.3, 0, 0, 0, 1 ]);
	
	this.vertexBuffer = this.context3D.createVertexBuffer (3, 6);
	this.vertexBuffer.uploadFromVector (vertices, 0, 3);
	
	var indices = Vector.ofArray ([ 0, 1, 2 ]);
	
	this.indexBuffer = this.context3D.createIndexBuffer (3);
	this.indexBuffer.uploadFromVector (indices, 0, 3);
	
	var assembler = new AGALMiniAssembler ();
	
	var vertexShader = assembler.assemble (Context3DProgramType.VERTEX,
		"m44 op, va0, vc0\n" +
		"mov v0, va1"
	);
	
	var fragmentShader = assembler.assemble (Context3DProgramType.FRAGMENT,
		"mov oc, v0"
	);
	
	this.program = this.context3D.createProgram ();
	this.program.upload (vertexShader, fragmentShader);
	
	this.addEventListener (Event.ENTER_FRAME, this.this_onEnterFrame);
	
}


// Event Listeners


App.prototype.this_onEnterFrame = function (event) {
	
	if (this.context3D == null) {
		
		return;
		
	}
	
	this.context3D.clear (1, 1, 1, 1);
	
	this.context3D.setProgram (this.program);
	this.context3D.setVertexBufferAt (0, this.vertexBuffer, 0, Context3DVertexBufferFormat.FLOAT_3);
	this.context3D.setVertexBufferAt (1, this.vertexBuffer, 3, Context3DVertexBufferFormat.FLOAT_3);
	
	var m = new Matrix3D ();
	m.appendRotation (Lib.getTimer () / 40, Vector3D.Z_AXIS);
	this.context3D.setProgramConstantsFromMatrix (Context3DProgramType.VERTEX, 0, m, true);
	
	this.context3D.drawTriangles (this.indexBuffer);
	
	this.context3D.present ();
	
}


// Entry Point


var stage = new Stage (550, 400, 0xFFFFFF, App);
document.body.appendChild (stage.element);