'use strict';

var _eachOfSeries = require('async/eachOfSeries');

var _eachOfSeries2 = _interopRequireDefault(_eachOfSeries);

var _logger = require('./lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _Routes = require('./Routes.js');

var _Routes2 = _interopRequireDefault(_Routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const io = require('socket.io')();
const port = 1337;

const fs = require('fs');

io.listen(port);

_logger2.default.log('debug', 'Socket.io is listening on port ' + port + '...');

const allRoutes = JSON.parse(fs.readFileSync(__dirname + '/persistent.json'));

io.on('connection', function (socket) {
	console.log("connection!");

	socket.on('apply', function (data) {
		destroyAllRoutes().then(data => {
			socket.emit('routesapplied', _Routes2.default.getRoutes());
		});
	});

	socket.on('routes', function (data) {
		console.log(_Routes2.default.getRoutes());
	});
});

//https://socket.io/docs/emit-cheatsheet/
_Routes2.default.on('outgoingpacket', uuid => {
	io.of('routes').to(uuid).emit('incoming', true);
});

_Routes2.default.on('incomingpacket', uuid => {
	io.of('routes').to(uuid).emit('outgoing', true);
});

loadRoutes(allRoutes);

function loadRoutes(routes) {
	(0, _eachOfSeries2.default)(routes, (val, key, next) => {
		_Routes2.default.addRoute(key, val);
		next();
	});
}
//# sourceMappingURL=server.js.map
