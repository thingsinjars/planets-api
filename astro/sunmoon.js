var AstroMath = require('./math'),
	Conversions = require('./conversions');

// SUN and MOON
// Alternative version of Sun position based on Schlyter's method

// Copyright Ole Nielsen 2002-2004
// Please read copyright notice in astrotools2.html source

// 'Meeus' means "Astronomical Algorithms", 2nd ed. by Jean Meeus

// ecliptic position of the Sun relative to Earth (basically simplified version of planetxyz calc)
function sunxyz(jday) {
	// return x,y,z ecliptic coordinates, distance, true longitude
	// days counted from 1999 Dec 31.0 UT
	var d = jday - 2451543.5;
	var w = 282.9404 + 4.70935E-5 * d; // argument of perihelion
	var e = 0.016709 - 1.151E-9 * d;
	var M = AstroMath.rev(356.0470 + 0.9856002585 * d); // mean anomaly
	var E = M + e * AstroMath.RAD2DEG * AstroMath.sind(M) * (1.0 + e * AstroMath.cosd(M));
	var xv = AstroMath.cosd(E) - e;
	var yv = Math.sqrt(1.0 - e * e) * AstroMath.sind(E);
	var v = AstroMath.atan2d(yv, xv); // true anomaly
	var r = Math.sqrt(xv * xv + yv * yv); // distance
	var lonsun = AstroMath.rev(v + w); // true longitude
	var xs = r * AstroMath.cosd(lonsun); // rectangular coordinates, zs = 0 for sun 
	var ys = r * AstroMath.sind(lonsun);
	return new Array(xs, ys, 0, r, lonsun, 0);
}

function SunAlt(jday, obs) {
	// return alt, az, time angle, ra, dec, ecl. long. and lat=0, illum=1, 0, dist, brightness 
	var sdat = sunxyz(jday);
	var ecl = 23.4393 - 3.563E-7 * (jday - 2451543.5);
	var xe = sdat[0];
	var ye = sdat[1] * AstroMath.cosd(ecl);
	var ze = sdat[1] * AstroMath.sind(ecl);
	var ra = AstroMath.rev(AstroMath.atan2d(ye, xe));
	var dec = AstroMath.atan2d(ze, Math.sqrt(xe * xe + ye * ye));
	var topo = Conversions.radec2aa(ra, dec, jday, obs);
	return new Array(topo[0], topo[1], topo[2], ra, dec, sdat[4], 0, 1, 0, sdat[3], -26.74);
}


// Sun rise and set times (if twilight==-0.833) or desired twilight time. Return julian days
function sunrise(obs, twilight) {
	// obs is a reference variable make a copy
	var obscopy = new Object();
	for (var i in obs) obscopy[i] = obs[i];
	obscopy.hours = 12;
	obscopy.minutes = 0;
	obscopy.seconds = 0;
	var riseset = new Array(0.0, 0.0, false, 0.0, 0.0);
	var lst = local_sidereal(obscopy);
	var jday = jd(obscopy);
	var radec = SunAlt(jday, obscopy);
	var ra = radec[3];
	var dec = radec[4];
	var UTsun = 12.0 + ra / 15.0 - lst;
	if (UTsun < 0.0) UTsun += 24.0;
	if (UTsun > 24.0) UTsun -= 24.0;
	var cosLHA = (AstroMath.sind(twilight) - AstroMath.sind(obs.latitude) * AstroMath.sind(dec)) / (AstroMath.cosd(obs.latitude) * AstroMath.cosd(dec));
	// Check for midnight sun and midday night. "riseset[2]" false if no rise and set found
	riseset[2] = false;
	if (cosLHA <= 1.0 && cosLHA >= -1.0) {
		// rise/set times allowing for not today.
		riseset[2] = true;
		var lha = AstroMath.cosd(cosLHA) / 15.0;
		if ((UTsun - lha) < 0.0) {
			var rtime = 24.0 + UTsun - lha;
		} else {
			var rtime = UTsun - lha;
		}
		riseset[0] = jday + rtime / 24.0 - 0.5;
		if ((UTsun + lha) > 24.0) {
			var stime = UTsun + lha - 24.0;
		} else {
			var stime = UTsun + lha;
			riseset[4] = stime;
		}
		riseset[1] = jday + stime / 24.0 - 0.5;
		// riseset[3] and [4] are times in UT hours
		riseset[3] = rtime;
		riseset[4] = stime;
	}
	return (riseset);
}


function MoonPos(jday, obs) {
	// MoonPos calculates the Moon position and distance, based on Meeus chapter 47
	// and the illuminated percentage from Meeus equations 48.4 and 48.1
	// OPN: This version of MoonPos calculates the position to a precision of about 2' or so
	// All T^2, T^3 and T^4 terms skipped. NB: Time is not taken from obs but from jday (julian day)
	// Returns alt, az, hour angle, ra, dec (geocentr!), eclip. long and lat (geocentr!), 
	// illumination, distance, brightness and phase angle 
	var T = (jday - 2451545.0) / 36525;
	// Moons mean longitude L'
	var LP = AstroMath.rev(218.3164477 + 481267.88123421 * T);
	// Moons mean elongation
	var D = AstroMath.rev(297.8501921 + 445267.1114034 * T);
	// Suns mean anomaly
	var M = AstroMath.rev(357.5291092 + 35999.0502909 * T);
	// Moons mean anomaly M'
	var MP = AstroMath.rev(134.9633964 + 477198.8675055 * T);
	// Moons argument of latitude
	var F = AstroMath.rev(93.2720950 + 483202.0175233 * T);
	// The "further arguments" A1, A2 and A3  and the term E have been ignored
	// Sum of most significant terms from table 45.A and 45.B (terms less than 0.004 deg / 40 km dropped)
	var Sl = 6288774 * AstroMath.sind(MP) + 1274027 * AstroMath.sind(2 * D - MP) + 658314 * AstroMath.sind(2 * D) + 213618 * AstroMath.sind(2 * MP) -
		185116 * AstroMath.sind(M) - 114332 * AstroMath.sind(2 * F) + 58793 * AstroMath.sind(2 * D - 2 * MP) + 57066 * AstroMath.sind(2 * D - M - MP) +
		53322 * AstroMath.sind(2 * D + MP) + 45758 * AstroMath.sind(2 * D - M) - 40923 * AstroMath.sind(M - MP) - 34720 * AstroMath.sind(D) -
		30383 * AstroMath.sind(M + MP) + 15327 * AstroMath.sind(2 * D - 2 * F) - 12528 * AstroMath.sind(MP + 2 * F) + 10980 * AstroMath.sind(MP - 2 * F) +
		10675 * AstroMath.sind(4 * D - MP) + 10034 * AstroMath.sind(3 * MP) + 8548 * AstroMath.sind(4 * D - 2 * MP) - 7888 * AstroMath.sind(2 * D + M - MP) -
		6766 * AstroMath.sind(2 * D + M) - 5163 * AstroMath.sind(D - MP) + 4987 * AstroMath.sind(D + M) + 4036 * AstroMath.sind(2 * D - M + MP);
	var Sb = 5128122 * AstroMath.sind(F) + 280602 * AstroMath.sind(MP + F) + 277602 * AstroMath.sind(MP - F) + 173237 * AstroMath.sind(2 * D - F) +
		55413 * AstroMath.sind(2 * D - MP + F) + 46271 * AstroMath.sind(2 * D - MP - F) + 32573 * AstroMath.sind(2 * D + F) + 17198 * AstroMath.sind(2 * MP + F) +
		9266 * AstroMath.sind(2 * D + MP - F) + 8822 * AstroMath.sind(2 * MP - F) + 8216 * AstroMath.sind(2 * D - M - F) + 4324 * AstroMath.sind(2 * D - 2 * MP - F) +
		4200 * AstroMath.sind(2 * D + MP + F);
	var Sr = (-20905355) * AstroMath.cosd(MP) - 3699111 * AstroMath.cosd(2 * D - MP) - 2955968 * AstroMath.cosd(2 * D) - 569925 * AstroMath.cosd(2 * MP) +
		246158 * AstroMath.cosd(2 * D - 2 * MP) - 152138 * AstroMath.cosd(2 * D - M - MP) - 170733 * AstroMath.cosd(2 * D + MP) - 204586 * AstroMath.cosd(2 * D - M) -
		129620 * AstroMath.cosd(M - MP) + 108743 * AstroMath.cosd(D) + 104755 * AstroMath.cosd(M + MP) + 79661 * AstroMath.cosd(MP - 2 * F) + 48888 * AstroMath.cosd(M);
	// geocentric longitude, latitude
	var mglong = AstroMath.rev(LP + Sl / 1000000.0);
	var mglat = Sb / 1000000.0;
	// Obliquity of Ecliptic
	var obl = 23.4393 - 3.563E-7 * (jday - 2451543.5);
	var ra = AstroMath.rev(AstroMath.atan2d(AstroMath.sind(mglong) * AstroMath.cosd(obl) - AstroMath.tand(mglat) * AstroMath.sind(obl), AstroMath.cosd(mglong)));
	var dec = AstroMath.sind(AstroMath.sind(mglat) * AstroMath.cosd(obl) + AstroMath.cosd(mglat) * AstroMath.sind(obl) * AstroMath.sind(mglong));
	var moondat = Conversions.radec2aa(ra, dec, jday, obs);
	// phase angle (48.4)
	var pa = Math.abs(180.0 - D - 6.289 * AstroMath.sind(MP) + 2.100 * AstroMath.sind(M) - 1.274 * AstroMath.sind(2 * D - MP) -
		0.658 * AstroMath.sind(2 * D) - 0.214 * AstroMath.sind(2 * MP) - 0.11 * AstroMath.sind(D));
	var k = (1 + AstroMath.cosd(pa)) / 2;
	var mr = Math.round(385000.56 + Sr / 1000.0);
	var h = moondat[0];
	// correct for parallax, equatorial horizontal parallax, see Meeus p. 337
	h -= AstroMath.sind(6378.14 / mr) * AstroMath.cosd(h);
	// brightness, use Paul Schlyter's formula (based on common phase law for Moon)
	var sdat = sunxyz(jday);
	var r = sdat[3]; // Earth (= Moon) distance to Sun in AU
	var R = mr / 149598000; // Moon distance to Earth in AU
	var mag = 0.23 + 5 * AstroMath.log10(r * R) + 0.026 * pa + 4.0E-9 * pa * pa * pa * pa
	return new Array(h, moondat[1], moondat[2], ra, dec, mglong, mglat, k, r, mr, mag);
} // Moonpos()

module.exports = {
	sunPosition: sunxyz,
	sunAltitude: SunAlt,
	moonPosition: MoonPos
};