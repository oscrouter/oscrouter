const io = require('socket.io')()
const port = 1337
import eachOfSeries from 'async/eachOfSeries';
import logger from './lib/logger';
const fs = require('fs')

io.listen(port)

logger.log('debug','Socket.io is listening on port ' + port + '...')

import Routes from './Routes.js';

const allRoutes = JSON.parse(fs.readFileSync(__dirname+'/persistent.json'));

io.on('connection', function (socket) {
	console.log("connection!");

	socket.on('apply', function(data) {
		destroyAllRoutes()
		.then((data) => {
			socket.emit('routesapplied',Routes.getRoutes());
		})
	})

	socket.on('routes', function(data) {
		console.log(Routes.getRoutes())
	})
})

//https://socket.io/docs/emit-cheatsheet/
Routes.on('outgoingpacket',(uuid) => {
	io.of('routes').to(uuid).emit('incoming', true);
})

Routes.on('incomingpacket',(uuid) => {
	io.of('routes').to(uuid).emit('outgoing', true);
})

loadRoutes(allRoutes)

function loadRoutes(routes) {
	eachOfSeries(
		routes,
		(val, key, next) => {
			Routes.addRoute(key, val)
			next();
		}
	)
}
