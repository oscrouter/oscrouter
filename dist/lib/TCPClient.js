'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _SocketServer = require('./SocketServer.js');

var _SocketServer2 = _interopRequireDefault(_SocketServer);

var _osc = require('osc');

var _osc2 = _interopRequireDefault(_osc);

var _logger = require('./logger.js');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TCPClient extends _SocketServer2.default {
	constructor(bind, port) {
		super(bind, port);

		this.ready = false;
		this.bind = bind;
		this.port = port;
		this.type = 'tcpclient';

		this.client = new _osc2.default.TCPSocketPort({
			address: bind,
			port: port
		});

		this.client.on("bundle", this.bundle.bind(this));

		this.client.on("message", this.message.bind(this));

		this.client.on("error", this.error.bind(this));

		this.client.on("ready", this.readyEvent.bind(this));

		this.client.on("raw", this.raw.bind(this));

		this.client.on("close", () => {
			this.ready = false;
		});

		this.client.open();
	}

	getType() {
		return this.type;
	}

	open() {
		this.client.open();
	}

	close() {
		this.client.close();
	}

	readyEvent() {
		this.ready = true;
		_logger2.default.log('debug', `TCP Client is connected to ${this.bind}:${this.port}`);
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
		if (!this.ready) {
			console.warn("The server is not ready to send messages");
			return;
		}
		this.client.send({
			address,
			args
		});
	}
}
exports.default = TCPClient;
//# sourceMappingURL=TCPClient.js.map
