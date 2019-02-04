const Observer = require('./observer');
const Planets = require('./planets');
const descriptions = require('./descriptions');

const AstroTools = {};

const visibleAboveAltitude = 5;
const onlyInclude = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'The Moon'];

// First get all planets
// then filter on various criteria
AstroTools.calculateVisiblePlanets = (latitude, longitude, time) => {
    const returnable = [];

    const allPlanets = AstroTools.calculatePlanets(latitude, longitude, time);
    const isDaytime = allPlanets[Planets.names.SUN].alt > -6.0;

    // Filter for those whose altitude is above 5°
    return allPlanets.filter(e => e.alt > visibleAboveAltitude)
        // Filter bodies that can't be seen without magnification
        .filter(e => e.mag < 6)
        // Filter dim bodies during daytime
        .filter(e => !isDaytime || (e.mag < -5));
}

AstroTools.calculatePlanets = (latitude, longitude, time) => {
    time = time ? new Date(time) : new Date();
    const bodies = Planets.makeBodies();

    const observer = Observer.make({
        latitude: latitude,
        longitude: longitude
    }, time);

    const julianDay = Observer.julianDay(observer);

    for (const index in Planets.names) {
        if (Planets.names.hasOwnProperty(index)) {
            bodies[Planets.names[index]].update(julianDay, observer);
        }
    }

    return bodies.map(addDescriptions);
}

const addDescriptions = (body) => ({
        ...body,
        description: {
            altitude: body.alt,
            azimuth: body.az
        }
    });

module.exports = AstroTools;

