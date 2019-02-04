module.exports = {

	altitude: (altitude) => {
		if(altitude < 0) {
			return "Below the horizon";
		}
		if(altitude < 15) {
			return "Barely above the horizon";
		}
		if(altitude < 20) {
			return "Low in the sky";
		}
		if(altitude < 50) {
			return "Quite high in the sky";
		}
		return "Very high in the sky";
	},

	azimuth: (azimuth) => {
		if(azimuth < 22.5) {
			return "North";
		}
		if(azimuth < 67.5) {
			return "Northeast";
		}
		if(azimuth < 112.5) {
			return "East";
		}
		if(azimuth < 157.5) {
			return "Southeast";
		}
		if(azimuth < 202.5) {
			return "South";
		}
		if(azimuth < 247.5) {
			return "Southwest";
		}
		if(azimuth < 292.5) {
			return "West";
		}
		if(azimuth < 337.5) {
			return "Northwest";
		}
		return "North";
	}
}