
import TCPClient from './lib/TCPClient.js'
import TCPServer from './lib/TCPServer.js'
import UDP from './lib/UDP.js'

class Sockets {
	constructor() {
		this.sockets = {}
	}

	addUDPPort(bind, port) {
		return this.getSocket('udpserver',bind, port)
	}

	addTCPClient(bind, port) {
		return this.getSocket('tcpclient',bind, port)
	}

	addTCPServer(bind, port) {
		return this.getSocket('tcpserver',bind, port)
	}

	removeSocket(type, bind, port) {
		if(this.sockets[bind][type][port]) {
			this.sockets[bind][type][port].close()
			delete(this.sockets[bind][type][port])
		}
	}

	getSocket(type, bind, port) {
		if(!this.sockets[bind]) {
			this.sockets[bind] = {}
		}
		if(!this.sockets[bind][type]) {
			this.sockets[bind][type] = {}
		}
		if(this.sockets[bind][type][port]) {
			return this.sockets[bind][type][port];
		}
		switch(type) {
			case 'tcpserver':
				this.sockets[bind][type][port] = new TCPServer(bind, port)
			break;
			case 'tcpclient':
				this.sockets[bind][type][port] = new TCPClient(bind, port)
			break;
			case 'udpserver':
				this.sockets[bind][type][port] = new UDP(bind, port)
			break;
		}

		return this.sockets[bind][type][port];
	}
}
export default new Sockets()