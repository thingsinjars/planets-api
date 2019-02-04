const restify = require('restify');

const astro = require('./astro/astro');
const config = require('./package.json');

const server = restify.createServer();

const onlyInclude = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'The Moon'];

function visible({ params: { latitude, longitude, time } }, res) {
	res.send(astro.calculateVisiblePlanets(latitude, longitude, time));
}

function planets({ params: { latitude, longitude, time } }, res) {
	res.set('X-Planets-Version', config.version)
		.send(astro.calculatePlanets(latitude, longitude, time)
		.filter(e => onlyInclude.indexOf(e.name) > -1));
}


server.get('/planets/:latitude/:longitude', planets);
server.get('/planets/:latitude/:longitude/:time', planets);
server.get('/visible/:latitude/:longitude', visible);
server.get('/visible/:latitude/:longitude/:time', visible);

server.listen(process.env.PORT || 8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});