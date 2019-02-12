'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _TCPClient = require('./lib/TCPClient.js');

var _TCPClient2 = _interopRequireDefault(_TCPClient);

var _TCPServer = require('./lib/TCPServer.js');

var _TCPServer2 = _interopRequireDefault(_TCPServer);

var _UDP = require('./lib/UDP.js');

var _UDP2 = _interopRequireDefault(_UDP);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Sockets {
	constructor() {
		this.sockets = {};
	}

	addUDPPort(bind, port) {
		return this.getSocket('udpserver', bind, port);
	}

	addTCPClient(bind, port) {
		return this.getSocket('tcpclient', bind, port);
	}

	addTCPServer(bind, port) {
		return this.getSocket('tcpserver', bind, port);
	}

	removeSocket(type, bind, port) {
		if (this.sockets[bind][type][port]) {
			this.sockets[bind][type][port].close();
			delete this.sockets[bind][type][port];
		}
	}

	getSocket(type, bind, port) {
		if (!this.sockets[bind]) {
			this.sockets[bind] = {};
		}
		if (!this.sockets[bind][type]) {
			this.sockets[bind][type] = {};
		}
		if (this.sockets[bind][type][port]) {
			return this.sockets[bind][type][port];
		}
		switch (type) {
			case 'tcpserver':
				this.sockets[bind][type][port] = new _TCPServer2.default(bind, port);
				break;
			case 'tcpclient':
				this.sockets[bind][type][port] = new _TCPClient2.default(bind, port);
				break;
			case 'udpserver':
				this.sockets[bind][type][port] = new _UDP2.default(bind, port);
				break;
		}

		return this.sockets[bind][type][port];
	}
}
exports.default = new Sockets();
//# sourceMappingURL=Servers.js.map
