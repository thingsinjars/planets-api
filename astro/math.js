// Extensions to the Math routines - Trig routines in degrees

// Copyright Peter Hayes 1999-2001, Ole Nielsen 2003-2004

var AstroMath = {};

AstroMath.DEG2RAD = Math.PI/180.0;
AstroMath.RAD2DEG = 180.0/Math.PI;

AstroMath.rev = function(angle) 	{return angle-Math.floor(angle/360.0)*360.0;}		// 0<=a<360
AstroMath.rev2 = function(angle)	{var a = AstroMath.rev(angle); return (a>=180 ? a-360.0 : a);}	// -180<=a<180
AstroMath.sind = function(angle) 	{return Math.sin(angle*AstroMath.DEG2RAD);}
AstroMath.cosd = function(angle) 	{return Math.cos(angle*AstroMath.DEG2RAD);}
AstroMath.tand = function(angle) 	{return Math.tan(angle*AstroMath.DEG2RAD);}
AstroMath.asind = function(c) 		{return AstroMath.RAD2DEG*Math.asin(c);}
AstroMath.acosd = function(c) 		{return AstroMath.RAD2DEG*Math.acos(c);}
AstroMath.atand = function(c) 		{return AstroMath.RAD2DEG*Math.atan(c);}
AstroMath.atan2d = function(y,x) 	{return AstroMath.RAD2DEG*Math.atan2(y,x);}
AstroMath.log10 = function(x) 		{return Math.LOG10E*Math.log(x);}
AstroMath.sqr = function(x)			{return x*x;}
AstroMath.cbrt = function(x)		{return Math.pow(x,1/3.0);}
AstroMath.SGN = function(x) 		{ return (x<0)?-1:+1; }

module.exports = AstroMath;