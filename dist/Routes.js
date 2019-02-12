'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Servers = require('./Servers.js');

var _Servers2 = _interopRequireDefault(_Servers);

var _sha = require('sha256');

var _sha2 = _interopRequireDefault(_sha);

var _eachOfSeries = require('async/eachOfSeries');

var _eachOfSeries2 = _interopRequireDefault(_eachOfSeries);

var _eachOf = require('async/eachOf');

var _eachOf2 = _interopRequireDefault(_eachOf);

var _routeParser = require('route-parser');

var _routeParser2 = _interopRequireDefault(_routeParser);

var _logger = require('./lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Routes extends _events2.default {
	constructor() {
		super();
		this.routes = {};
		this.servers = {};
	}

	getServer(type, ip, port) {
		const sha = this.getSha(type, ip, port);
		if (this.servers[sha]) {
			return this.servers[sha];
		}
		let server = null;
		switch (type) {
			case 'udp':
				server = _Servers2.default.addUDPPort(ip, port);
				break;
			case 'tcpserver':
				server = _Servers2.default.addTCPServer(ip, port);
				break;
			case 'tcpclient':
				server = _Servers2.default.addTCPClient(ip, port);
				break;
			default:
				const err = `Invalid Server Type ${type}!`;
				throw err;
				break;
		}

		server.on("message", (message, timeTag, remoteInfo, localInfo, type) => {
			this.message(message, timeTag, remoteInfo, localInfo, type, sha);
		});

		this.servers[sha] = server;
	}

	getRoutes() {
		return this.routes;
	}

	addRoute(uuid, settings) {
		if (!settings.incomingport.length) {
			throw "Incoming Port is REQUIRED";
		}
		const incomingip = settings.incomingip.length ? settings.incomingip : '0.0.0.0';
		const incomingport = settings.incomingport;
		const incomingtype = settings.incomingtype;
		const incomingsha = this.getSha(incomingtype, incomingip, incomingport);
		this.getServer(incomingtype, incomingip, incomingport);

		//Theres no need to create a specific outgoing udp since its udp
		if (settings.outgoingtype === 'udp') {
			settings.outgoingsha = incomingsha;
		} else {
			const outgoingip = settings.outgoingip.length ? settings.outgoingip : incomingip;
			const outgoingport = settings.outgoingport.length ? settings.outgoingport : incomingport;
			const outgoingtype = settings.outgoingtype.length ? settings.outgoingtype : incomingtype;
			const outgoingsha = this.getSha(outgoingtype, outgoingip, outgoingport);
			this.getServer(outgoingtype, outgoingip, outgoingport);
			settings.outgoingsha = outgoingsha;
		}

		settings.incomingsha = incomingsha;

		if (!this.routes[incomingsha]) {
			this.routes[incomingsha] = {};
		}
		this.routes[incomingsha][uuid] = settings;
	}

	replaceRoutes(routes) {}

	destroyAllRoutes() {
		return new Promise((resolve, reject) => {
			(0, _eachOfSeries2.default)(this.servers, (socket, sha, next) => {
				socket.close();
				next();
			}, err => {
				if (err) {
					reject(err);
					return;
				}
				delete this.sockets;
				this.sockets = {};
				delete this.routes;
				this.routes = {};
				resolve();
			});
		});
	}

	message(message, timeTag, remoteInfo, localInfo, type, sha) {

		let socketType = type === 'udp' ? 'UDP' : 'TCP';
		_logger2.default.log('debug', `A ${socketType} OSC message just arrived from ${remoteInfo.address} to ${localInfo.port}`, { address: message.address, args: message.args, timeTag });

		const routes = this.routes[sha];

		(0, _eachOf2.default)(routes, (route, uuid, next) => {
			this.emit('incomingpacket', uuid);
			const sendersha = route.outgoingsha;
			const i = new _routeParser2.default(route.incomingpath);
			const params = i.match(message.address);
			if (!params) {
				next();
				return;
			}
			const o = new _routeParser2.default(route.outgoingpath);
			if (route.outgoingtype === 'udp') {
				if (route.incomingip.length && route.incomingip !== remoteInfo.address) {
					next();
					return;
				}
				const outgoingip = route.outgoingip.length ? route.outgoingip : remoteInfo.address;
				const outgoingport = route.outgoingport.length ? route.outgoingport : localInfo.port;
				_logger2.default.log('debug', `Sending UDP OSC message to ${outgoingip}:${outgoingport}`, { address: o.reverse(params), args: message.args });
				this.servers[sendersha].send(o.reverse(params), message.args, outgoingip, outgoingport);
				this.emit('outgoingpacket', uuid);
			} else {
				let stype = route.outgoingtype === 'tcpserver' ? 'clients' : 'server';
				_logger2.default.log('debug', `Sending TCP OSC message to ${stype}`, { address: o.reverse(params), args: message.args });
				this.servers[sendersha].send(o.reverse(params), message.args);
				this.emit('outgoingpacket', uuid);
			}

			next();
		});
	}

	getSha(type, ip, port) {
		return (0, _sha2.default)(type + ip + port);
	}
}
exports.default = new Routes();
//# sourceMappingURL=Routes.js.map
