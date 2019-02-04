var zoneinfo = require('zoneinfo'),
	CoordinateTZ = require('coordinate-tz'),
	TZDate = zoneinfo.TZDate;

var Observer = {};

Observer.make = function(place, time) {
	var observerTime, tz, tzDate, tzOffset;

	// if no date is specified, use now
	if(typeof time === 'undefined') {
		tzDate = new TZDate();
	} else {
		tzDate = new TZDate(Date.parse(time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()));
	}

	tz = CoordinateTZ.calculate(place.latitude,place.longitude);
	tzDate.setTimezone(tz.timezone);
	tzOffset = tzDate._zoneinfo.ttinfo_std.offset;

	observerTime = new Date(tzDate.format("Y-m-d H:i"));
	
	return {
		time: observerTime,
		timezoneOffset: tzOffset,
		position: {
			latitude: place.latitude,
			longitude: place.longitude
		}
	};
}

// The Julian date at 0 hours(*) UT at Greenwich
// (*) or actual UT time if day comprises time as fraction
function julianDayZero(year, month, day) {
	if (month < 2) {
		month += 12; 
		year -= 1
	};
	var a = Math.floor(year/100);
	var b = 2-a+Math.floor(a/4);
	var julianDayZero = Math.floor(365.25*(year+4716))+Math.floor(30.6001*(month+2))+day+b-1524.5;
	return julianDayZero;
}

// The Julian date at observer time
Observer.julianDay = function(observer) {
	// return observer.time.getTime()/86400000 + 2440587.5;
	var julianDay = julianDayZero(observer.time.getFullYear(),observer.time.getMonth(),observer.time.getDate());
	julianDay+=(observer.time.getHours()+((observer.time.getMinutes()+observer.timezoneOffset)/60.0)+(observer.time.getSeconds()/3600.0))/24;
	return julianDay;
}

module.exports = Observer;