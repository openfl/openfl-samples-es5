'use strict';
var Bitmap = require ("openfl/display/Bitmap").default;
var BitmapData = require ("openfl/display/BitmapData").default;
var Sprite = require ("openfl/display/Sprite").default;
var Stage = require ("openfl/display/Stage").default;
var StageAlign = require ("openfl/display/StageAlign").default;
var StageScaleMode = require ("openfl/display/StageScaleMode").default;
var Texture = require ("openfl/display3D/textures/Texture").default;
var Context3D = require ("openfl/display3D/Context3D").default;
var Context3DBlendFactor = require ("openfl/display3D/Context3DBlendFactor").default;
var Context3DProgramType = require ("openfl/display3D/Context3DProgramType").default;
var Context3DTextureFormat = require ("openfl/display3D/Context3DTextureFormat").default;
var Context3DVertexBufferFormat = require ("openfl/display3D/Context3DVertexBufferFormat").default;
var IndexBuffer3D = require ("openfl/display3D/IndexBuffer3D").default;
var Program3D = require ("openfl/display3D/Program3D").default;
var VertexBuffer3D = require ("openfl/display3D/VertexBuffer3D").default;
var Event = require ("openfl/events/Event").default;
var KeyboardEvent = require ("openfl/events/KeyboardEvent").default;
var Matrix3D = require ("openfl/geom/Matrix3D").default;
var Rectangle = require ("openfl/geom/Rectangle").default;
var Vector3D = require ("openfl/geom/Vector3D").default;
var Keyboard = require ("openfl/ui/Keyboard").default;
var AGALMiniAssembler = require ("openfl/utils/AGALMiniAssembler").default;
var Assets = require ("openfl/utils/Assets").default;
var Timer = require ("openfl/utils/Timer").default;
var Lib = require ("openfl/Lib").default;
var Vector = require ("openfl/Vector").default;
var PerspectiveMatrix3D = require ("./perspectiveMatrix3D").default;


var App = function () {
	
	Sprite.call (this);
	
	this.stage_onKeyDown = this.stage_onKeyDown.bind (this);
	this.stage_onKeyUp = this.stage_onKeyUp.bind (this);
	this.stage3D_onContext3DCreate = this.stage3D_onContext3DCreate.bind (this);
	this.this_onEnterFrame = this.this_onEnterFrame.bind (this);
	
	this.stage.stage3Ds[0].addEventListener (Event.CONTEXT3D_CREATE, this.stage3D_onContext3DCreate);
	this.stage.stage3Ds[0].requestContext3D ();
	
	this.stage.scaleMode = StageScaleMode.NO_SCALE;
	this.stage.align = StageAlign.TOP_LEFT;
	
	this.addEventListener (Event.ENTER_FRAME, this.this_onEnterFrame);
	
	this.stage.addEventListener (KeyboardEvent.KEY_DOWN, this.stage_onKeyDown);
	this.stage.addEventListener (KeyboardEvent.KEY_UP, this.stage_onKeyUp);
	
}

App.prototype = Object.create (Sprite.prototype);
App.prototype.constructor = App;


App.DAMPING = 1.09;
App.LINEAR_ACCELERATION = 0.0005;
App.MAX_FORWARD_VELOCITY = 0.05;
App.MAX_ROTATION_VELOCITY = 0.5;
App.ROTATION_ACCELERATION = 0.01;


App.prototype.calculateUpdatedVelocity = function (curVelocity, curAcceleration, maxVelocity) {
	
	var newVelocity;
	
	if (curAcceleration != 0) {
		
		newVelocity = curVelocity + curAcceleration;
		
		if (newVelocity > maxVelocity) {
			
			newVelocity = maxVelocity;
			
		} else if (newVelocity < -maxVelocity) {
			
			newVelocity = - maxVelocity;
			
		}
		
	} else {
		
		newVelocity = curVelocity / App.DAMPING;
		
	}
	
	return newVelocity;
	
}


App.prototype.initialize = function () {
	
	this.context3D = stage.stage3Ds[0].context3D;
	
	this.context3D.configureBackBuffer (550, 400, 1, true);
	
	var vertices = Vector.ofArray ([
		-0.3, -0.3, 0, 0, 0,
		-0.3, 0.3, 0, 0, 1,
		0.3, 0.3, 0, 1, 1,
		0.3, -0.3, 0, 1, 0 ]);
	
	this.vertexbuffer = this.context3D.createVertexBuffer (4, 5);
	this.vertexbuffer.uploadFromVector (vertices, 0, 4);
	
	this.indexBuffer = this.context3D.createIndexBuffer (6);
	this.indexBuffer.uploadFromVector (Vector.ofArray ([ 0, 1, 2, 2, 3, 0 ]), 0, 6);
	
	this.texture = this.context3D.createTexture (this.bitmapData.width, this.bitmapData.height, Context3DTextureFormat.BGRA, false);
	this.texture.uploadFromBitmapData (this.bitmapData);
	
	var vertexShaderAssembler  = new AGALMiniAssembler ();
	vertexShaderAssembler.assemble (Context3DProgramType.VERTEX,
		"m44 op, va0, vc0\n" +
		"mov v0, va1"
	);
	
	var fragmentShaderAssembler = new AGALMiniAssembler ();
	fragmentShaderAssembler.assemble (Context3DProgramType.FRAGMENT,
		"tex ft1, v0, fs0 <2d,linear,nomip>\n" +
		"mov oc, ft1"
	);
	
	this.program = this.context3D.createProgram ();
	this.program.upload (vertexShaderAssembler.agalcode, fragmentShaderAssembler.agalcode);
	
	this.cameraWorldTransform = new Matrix3D ();
	this.cameraWorldTransform.appendTranslation (0, 0, -2);
	this.viewTransform = new Matrix3D ();
	this.viewTransform = this.cameraWorldTransform.clone ();
	this.viewTransform.invert ();
	
	this.cameraLinearVelocity = new Vector3D ();
	this.cameraRotationVelocity = 0;
	
	this.cameraLinearAcceleration = 0;
	this.cameraRotationAcceleration = 0;
	
	this.projectionTransform = new PerspectiveMatrix3D ();
	
	var aspect = 4 / 3;
	var zNear = 0.1;
	var zFar = 1000;
	var fov = 45 * Math.PI / 180;
	
	this.projectionTransform.perspectiveFieldOfViewLH (fov, aspect, zNear, zFar);
	
}


App.prototype.render = function () {
	
	if (this.context3D == null) {
		
		return;
		
	}
	
	this.context3D.clear (1, 1, 1, 1);
	this.context3D.setBlendFactors (Context3DBlendFactor.ONE, Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
	
	this.context3D.setVertexBufferAt (0, this.vertexbuffer, 0, Context3DVertexBufferFormat.FLOAT_3);
	this.context3D.setVertexBufferAt (1, this.vertexbuffer, 3, Context3DVertexBufferFormat.FLOAT_2);
	
	this.context3D.setTextureAt (0, this.texture);
	this.context3D.setProgram (this.program);
	
	this.updateViewMatrix ();
	
	var matrix = new Matrix3D ();
	matrix.appendRotation (Lib.getTimer () / 30, Vector3D.Y_AXIS);
	matrix.appendRotation (Lib.getTimer () / 10, Vector3D.X_AXIS);
	matrix.appendTranslation (0, 0, -1);
	matrix.append (this.viewTransform);
	matrix.append (this.projectionTransform);
	
	this.context3D.setProgramConstantsFromMatrix (Context3DProgramType.VERTEX, 0, matrix, true);
	
	this.context3D.drawTriangles (this.indexBuffer);
	this.context3D.present ();
	
}


App.prototype.updateViewMatrix = function () {
	
	this.cameraLinearVelocity.z = this.calculateUpdatedVelocity (this.cameraLinearVelocity.z, this.cameraLinearAcceleration, App.MAX_FORWARD_VELOCITY);
	this.cameraRotationVelocity = this.calculateUpdatedVelocity (this.cameraRotationVelocity, this.cameraRotationAcceleration, App.MAX_ROTATION_VELOCITY); 
	
	this.cameraWorldTransform.appendRotation (this.cameraRotationVelocity, Vector3D.Y_AXIS, this.cameraWorldTransform.position);
	this.cameraWorldTransform.position = this.cameraWorldTransform.transformVector (this.cameraLinearVelocity);
	
	this.viewTransform.copyFrom (this.cameraWorldTransform);
	this.viewTransform.invert ();
	
}


// Event Handlers


App.prototype.stage_onKeyDown = function (event) {
	
	switch (event.keyCode) {
		
		case Keyboard.LEFT:
			
			this.cameraRotationAcceleration = -App.ROTATION_ACCELERATION;
			break;
		
		case Keyboard.UP:
			
			this.cameraLinearAcceleration = App.LINEAR_ACCELERATION;
			break;
		
		case Keyboard.RIGHT:
			
			this.cameraRotationAcceleration = App.ROTATION_ACCELERATION;
			break;
		
		case Keyboard.DOWN:
			
			this.cameraLinearAcceleration = -App.LINEAR_ACCELERATION;
			break;
		
	}
	
}


App.prototype.stage_onKeyUp = function (event) {
	
	switch (event.keyCode) {
		
		case Keyboard.LEFT:
		case Keyboard.RIGHT:
			
			this.cameraRotationAcceleration = 0;
			break;
		
		case Keyboard.UP:
		case Keyboard.DOWN:
			
			this.cameraLinearAcceleration = 0;
			break;
		
		
	}
	
}


App.prototype.stage3D_onContext3DCreate = function (event) {
	
	BitmapData.loadFromFile ("openfl.png").onComplete ((bitmapData) => {
		
		this.bitmapData = bitmapData;
		
		this.initialize ();
		
	}).onError ((e) => {
		
		console.error (e);
		
	});
	
}


App.prototype.this_onEnterFrame = function (event) {
	
	this.render ();
	
}


// Entry Point


var stage = new Stage (550, 400, 0xFFFFFF, App);
document.body.appendChild (stage.element);