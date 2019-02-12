'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _SocketServer = require('./SocketServer.js');

var _SocketServer2 = _interopRequireDefault(_SocketServer);

var _osc = require('osc');

var _osc2 = _interopRequireDefault(_osc);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _each = require('async/each');

var _each2 = _interopRequireDefault(_each);

var _logger = require('./logger.js');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TCPServer extends _SocketServer2.default {
	constructor(bind, port) {
		super(bind, port);

		this.ready = false;
		this.bind = bind;
		this.port = port;
		this.type = 'tcpserver';
		this.clients = [];

		this.netServer = _net2.default.createServer(socket => {
			const uuid = (0, _v2.default)();
			const client = new _osc2.default.TCPSocketPort({
				socket: socket
			});

			_logger2.default.log('debug', `TCP Client connected to ${this.bind}:${this.port}`);

			client.on("close", () => {
				_logger2.default.log('debug', `TCP Client disconnected from ${this.bind}:${this.port}`);
				delete this.clients[uuid];
			});

			client.on("ready", () => {
				this.clients[uuid] = client;
			});

			client.on("message", (message, timeTag, info) => {
				this.message(message, timeTag, { address: socket.remoteAddress, port: socket.remotePort });
			});

			client.on("bundle", (oscBundle, timeTag, info) => {
				this.bundle(oscBundle, timeTag, { address: socket.remoteAddress, port: socket.remotePort });
			});

			client.on("error", this.error.bind(this));

			client.on("raw", (data, info) => {
				this.raw(data, info, { address: socket.remoteAddress, port: socket.remotePort });
			});
		});
		this.open();
	}

	getType() {
		return this.type;
	}

	open() {
		this.netServer.listen(this.port, this.bind, () => {
			this.ready = true;
			_logger2.default.log('debug', `TCP Server is listening on ${this.bind}:${this.port}`);
		});
	}

	close() {
		this.netServer.close();
	}

	error(err) {
		console.error(err);
	}

	raw(data, info) {
		this.emit('raw', data, info, { address: this.bind, port: this.port }, this.type);
	}

	bundle(oscBundle, timeTag, info) {
		this.emit('bundle', oscBundle, timeTag, info, { address: this.bind, port: this.port }, this.type);
	}

	message(message, timeTag, info) {
		this.emit('message', message, timeTag, info, { address: this.bind, port: this.port }, this.type);
	}

	send(address, args) {
		(0, _each2.default)(this.clients, (client, next) => {
			client.send({
				address,
				args
			});
			next();
		});
	}
}
exports.default = TCPServer;
//# sourceMappingURL=TCPServer.js.map
