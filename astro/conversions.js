var AstroMath = require('./math');

function radecr(obj, sun, jday, obs) {
	// radecr returns ra, dec and earth distance
	// obj and sun comprise Heliocentric Ecliptic Rectangular Coordinates
	// (note Sun coords are really Earth heliocentric coordinates with reverse signs)
	// Equatorial geocentric co-ordinates
	var xg = obj[0] + sun[0];
	var yg = obj[1] + sun[1];
	var zg = obj[2];
	// Obliquity of Ecliptic (exponent corrected, was E-9!)
	var obl = 23.4393 - 3.563E-7 * (jday - 2451543.5);
	// Convert to eq. co-ordinates
	var x1 = xg;
	var y1 = yg * AstroMath.cosd(obl) - zg * AstroMath.sind(obl);
	var z1 = yg * AstroMath.sind(obl) + zg * AstroMath.cosd(obl);
	// RA and dec (33.2)
	var ra = AstroMath.rev(AstroMath.atan2d(y1, x1));
	var dec = AstroMath.atan2d(z1, Math.sqrt(x1 * x1 + y1 * y1));
	var dist = Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1);
	return new Array(ra, dec, dist);
}


function radec2aa(rightAscension, declination, julianDay, observer) {
	// Convert rightAscension/declination to alt/az, also return hour angle, azimut = 0 when north
	// DOES NOT correct for parallax!
	// TH0=Greenwich sid. time (eq. 12.4), H=hour angle (chapter 13)
	var TH0 = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0);
	var H = AstroMath.rev(TH0 - observer.position.longitude - rightAscension);
	var alt = AstroMath.asind(AstroMath.sind(observer.position.latitude) * AstroMath.sind(declination) + AstroMath.cosd(observer.position.latitude) * AstroMath.cosd(declination) * AstroMath.cosd(H));
	var az = AstroMath.atan2d(AstroMath.sind(H), (AstroMath.cosd(H) * AstroMath.sind(observer.position.latitude) - AstroMath.tand(declination) * AstroMath.cosd(observer.position.latitude)));
	return [alt, AstroMath.rev(az + 180.0), H];
}


function separation(ra1, ra2, dec1, dec2) {
	// ra, dec may also be long, lat, but PA is relative to the chosen coordinate system
	var d = AstroMath.acosd(AstroMath.sind(dec1) * AstroMath.sind(dec2) + AstroMath.cosd(dec1) * AstroMath.cosd(dec2) * AstroMath.cosd(ra1 - ra2)); // (Meeus 17.1)
	if (d < 0.1) d = Math.sqrt(AstroMath.sqr(AstroMath.rev2(ra1 - ra2) * AstroMath.cosd((dec1 + dec2) / 2)) + AstroMath.sqr(dec1 - dec2)); // (17.2)
	var pa = AstroMath.atan2d(AstroMath.sind(ra1 - ra2), AstroMath.cosd(dec2) * AstroMath.tand(dec1) - AstroMath.sind(dec2) * AstroMath.cosd(ra1 - ra2)); // angle
	return new Array(d, AstroMath.rev(pa));
} // end separation()

module.exports = {
	radecr: radecr,
	radec2aa: radec2aa,
	separation: separation
};