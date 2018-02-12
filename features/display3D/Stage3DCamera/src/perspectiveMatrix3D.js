/*
Copyright (c) 2011, Adobe Systems Incorporated
All rights reserved.
Redistribution and use in source and binary forms, with or without 
modification, are permitted provided that the following conditions are
met:
* Redistributions of source code must retain the above copyright notice, 
this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the 
documentation and/or other materials provided with the distribution.
* Neither the name of Adobe Systems Incorporated nor the names of its 
contributors may be used to endorse or promote products derived from 
this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR 
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


var Matrix3D = require ("openfl/geom/Matrix3D").default;
var Vector3D = require ("openfl/geom/Vector3D").default;
var Vector = require ("openfl/Vector").default;


var PerspectiveMatrix3D = function () {
	
	Matrix3D.call (this);
	
	this._x = new Vector3D ();
	this._y = new Vector3D ();
	this._z = new Vector3D ();
	this._w = new Vector3D ();
	
}

PerspectiveMatrix3D.prototype = Object.create (Matrix3D.prototype);
PerspectiveMatrix3D.prototype.constructor = PerspectiveMatrix3D;


PerspectiveMatrix3D.prototype.lookAtLH = function (eye, at, up) {
	
	this._z.copyFrom (at);
	this._z.subtract (eye);
	this._z.normalize ();
	this._z.w = 0.0;
	
	this._x.copyFrom (up);
	this._crossProductTo (this._x, this._z);
	this._x.normalize ();
	this._x.w = 0.0;
	
	this._y.copyFrom (this._z);
	this._crossProductTo (this._y, this._x);
	this._y.w = 0.0;
	
	this._w.x = this._x.dotProduct (eye);
	this._w.y = this._y.dotProduct (eye);
	this._w.z = this._z.dotProduct (eye);
	this._w.w = 1.0;
	
	this.copyRowFrom (0, this._x);
	this.copyRowFrom (1, this._y);
	this.copyRowFrom (2, this._z);
	this.copyRowFrom (3, this._w);
	
}


PerspectiveMatrix3D.prototype.lookAtRH = function (eye, at, up) {
	
	this._z.copyFrom (eye);
	this._z.subtract (at);
	this._z.normalize ();
	this._z.w = 0.0;
	
	this._x.copyFrom (up);
	this._crossProductTo (this._x, this._z);
	this._x.normalize ();
	this._x.w = 0.0;
	
	this._y.copyFrom (this._z);
	this._crossProductTo (this._y, this._x);
	this._y.w = 0.0;
	
	this._w.x = this._x.dotProduct (eye);
	this._w.y = this._y.dotProduct (eye);
	this._w.z = this._z.dotProduct (eye);
	this._w.w = 1.0;
	
	this.copyRowFrom (0, this._x);
	this.copyRowFrom (1, this._y);
	this.copyRowFrom (2, this._z);
	this.copyRowFrom (3, this._w);
	
}


PerspectiveMatrix3D.prototype.orthoLH = function (width, height, zNear, zFar) {
	
	this.copyRawDataFrom (Vector.ofArray ([
		2.0 / width, 0.0, 0.0, 0.0,
		0.0, 2.0 / height, 0.0, 0.0,
		0.0, 0.0, 1.0 / (zFar - zNear), 0.0,
		0.0, 0.0, zNear / (zNear - zFar), 1.0
	]));
	
}


PerspectiveMatrix3D.prototype.orthoOffCenterLH = function (left, right, bottom, top, zNear, zFar) {
	
	this.copyRawDataFrom (Vector.ofArray ([
		2.0 / (right - left), 0.0, 0.0, 0.0,
		0.0, 2.0 * zNear / (top - bottom), 0.0, 0.0,
		-1.0 - 2.0 * left / (right - left), 1.0 + 2.0 * top / (bottom - top), 1.0 / (zFar - zNear), 0.0,
		0.0, 0.0, zNear / (zNear - zFar), 1.0
	]));
	
}


PerspectiveMatrix3D.prototype.orthoOffCenterRH = function (left, right, bottom, top, zNear, zFar) {
	
	this.copyRawDataFrom (Vector.ofArray ([
		2.0 / (right - left), 0.0, 0.0, 0.0,
		0.0, 2.0 * zNear / (top - bottom), 0.0, 0.0,
		-1.0 - 2.0 * left / (right - left), 1.0 + 2.0 * top / (bottom - top), 1.0 / (zNear - zFar), 0.0,
		0.0, 0.0, zNear / (zNear - zFar), 1.0
	]));
	
}


PerspectiveMatrix3D.prototype.orthoRH = function (width, height, zNear, zFar) {
	
	this.copyRawDataFrom (Vector.ofArray ([
		2.0 / width, 0.0, 0.0, 0.0,
		0.0, 2.0 / height, 0.0, 0.0,
		0.0, 0.0, 1.0 / (zNear - zNear), 0.0,
		0.0, 0.0, zNear / (zNear - zFar), 1.0
	]));
	
}


PerspectiveMatrix3D.prototype.perspectiveFieldOfViewLH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
	
	var yScale = 1.0 / Math.tan (fieldOfViewY / 2.0);
	var xScale = yScale / aspectRatio;
	
	this.copyRawDataFrom (Vector.ofArray ([
		xScale, 0.0, 0.0, 0.0,
		0.0, yScale, 0.0, 0.0,
		0.0, 0.0, zFar / (zFar - zNear), 1.0,
		0.0, 0.0, (zNear * zFar) / (zNear - zFar), 0.0
	]));
	
}


PerspectiveMatrix3D.prototype.perspectiveFieldOfViewRH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
	
	var yScale = 1.0 / Math.tan (fieldOfViewY / 2.0);
	var xScale = yScale / aspectRatio;
	
	this.copyRawDataFrom (Vector.ofArray ([
		xScale, 0.0, 0.0, 0.0,
		0.0, yScale, 0.0, 0.0,
		0.0, 0.0, zFar / (zNear - zFar), -1.0,
		0.0, 0.0, (zNear * zFar) / (zNear - zFar), 0.0
	]));
	
}


PerspectiveMatrix3D.prototype.perspectiveOffCenterLH = function (left, right, bottom, top, zNear, zFar) {
	
	this.copyRawDataFrom (Vector.ofArray ([
		2.0 * zNear / (right - left), 0.0, 0.0, 0.0,
		0.0, -2.0 * zNear / (bottom - top), 0.0, 0.0,
		-1.0 - 2.0 * left / (right - left), 1.0 + 2.0 * top / (bottom - top), -zFar / (zNear - zFar), 1.0,
		0.0, 0.0, (zNear * zFar) / (zNear - zFar), 0.0
	]));
	
}


PerspectiveMatrix3D.prototype.perspectiveLH = function (width, height, zNear, zFar) {
	
	this.copyRawDataFrom (Vector.ofArray ([
		2.0 * zNear / width, 0.0, 0.0, 0.0,
		0.0, 2.0 * zNear / height, 0.0, 0.0,
		0.0, 0.0, zFar / (zFar - zNear), 1.0,
		0.0, 0.0, zNear * zFar / (zNear - zFar), 0.0
	]));
	
}


PerspectiveMatrix3D.prototype.perspectiveOffCenterRH = function (left, right, bottom, top, zNear, zFar) {
	
	this.copyRawDataFrom (Vector.ofArray ([
		2.0 * zNear / (right - left), 0.0, 0.0, 0.0,
		0.0, -2.0 * zNear / (bottom - top), 0.0, 0.0,
		1.0 + 2.0 * left / (right - left), -1.0 - 2.0 * top / (bottom - top), zFar / (zNear - zFar), -1.0,
		0.0, 0.0, (zNear * zFar) / (zNear - zFar), 0.0
	]));
	
}


PerspectiveMatrix3D.prototype.perspectiveRH = function (width, height, zNear, zFar) {
	
	this.copyRawDataFrom (Vector.ofArray ([
		2.0 * zNear / width, 0.0, 0.0, 0.0,
		0.0, 2.0 * zNear / height, 0.0, 0.0,
		0.0, 0.0, zFar / (zNear - zFar), -1.0,
		0.0, 0.0, zNear * zFar / (zNear - zFar), 0.0
	]));
	
}


PerspectiveMatrix3D.prototype._crossProductTo = function (a, b) {
	
	this._w.x = a.y * b.z - a.z * b.y;
	this._w.y = a.z * b.x - a.x * b.z;
	this._w.z = a.x * b.y - a.y * b.x;
	this._w.w = 1.0;
	a.copyFrom (this._w);
	
}


module.exports.PerspectiveMatrix3D = PerspectiveMatrix3D;
module.exports.default = PerspectiveMatrix3D;