import Servers from './Servers.js';
import sha256 from 'sha256';
import eachOfSeries from 'async/eachOfSeries';
import eachOf from 'async/eachOf';
import routeParser from 'route-parser';
import logger from './lib/logger';
import EventEmitter from 'events';

class Routes extends EventEmitter {
	constructor() {
		super()
		this.routes = {}
		this.servers = {}
	}

	getServer(type, ip, port) {
		const sha = this.getSha(type, ip, port)
		if(this.servers[sha]) {
			return this.servers[sha];
		}
		let server = null
		switch(type) {
			case 'udp':
				server = Servers.addUDPPort(ip, port)
			break;
			case 'tcpserver':
				server = Servers.addTCPServer(ip, port)
			break;
			case 'tcpclient':
				server = Servers.addTCPClient(ip, port)
			break;
			default:
				const err = `Invalid Server Type ${type}!`
				throw err
			break;
		}

		server.on(
			"message",
			(message, timeTag, remoteInfo, localInfo, type) => {
				this.message(message, timeTag, remoteInfo, localInfo, type, sha)
			}
		)

		this.servers[sha] = server
	}

	getRoutes() {
		return this.routes;
	}

	addRoute(uuid, settings) {
		if(!settings.incomingport.length) {
			throw "Incoming Port is REQUIRED"
		}
		const incomingip = settings.incomingip.length ? settings.incomingip : '0.0.0.0'
		const incomingport = settings.incomingport
		const incomingtype = settings.incomingtype
		const incomingsha = this.getSha(incomingtype,incomingip,incomingport)
		this.getServer(incomingtype,incomingip,incomingport)

		//Theres no need to create a specific outgoing udp since its udp
		if(settings.outgoingtype === 'udp') {
			settings.outgoingsha = incomingsha
		} else {
			const outgoingip = settings.outgoingip.length ? settings.outgoingip : incomingip
			const outgoingport = settings.outgoingport.length ? settings.outgoingport : incomingport
			const outgoingtype = settings.outgoingtype.length ? settings.outgoingtype : incomingtype
			const outgoingsha = this.getSha(outgoingtype,outgoingip,outgoingport)
			this.getServer(outgoingtype,outgoingip,outgoingport)
			settings.outgoingsha = outgoingsha
		}

		settings.incomingsha = incomingsha

		if(!this.routes[incomingsha]) {
			this.routes[incomingsha] = {}
		}
		this.routes[incomingsha][uuid] = settings
	}

	replaceRoutes(routes) {
		
	}

	destroyAllRoutes() {
		return new Promise((resolve, reject) => {
			eachOfSeries(
				this.servers,
				(socket, sha, next) => {
					socket.close()
					next()
				}, (err) => {
					if(err) {
						reject(err)
						return
					}
					delete(this.sockets)
					this.sockets = {}
					delete(this.routes)
					this.routes = {}
					resolve()
				}
			);
		})
		
	}

	message(message, timeTag, remoteInfo, localInfo, type, sha) {

		let socketType = (type === 'udp' ) ? 'UDP' : 'TCP'
		logger.log('debug',`A ${socketType} OSC message just arrived from ${remoteInfo.address} to ${localInfo.port}`, {address: message.address, args: message.args, timeTag})

		const routes = this.routes[sha]

		eachOf(
			routes,
			(route, uuid, next) => {
				this.emit('incomingpacket',uuid)
				const sendersha = route.outgoingsha
				const i = new routeParser(route.incomingpath)
				const params = i.match(message.address)
				if(!params) {
					next()
					return
				}
				const o = new routeParser(route.outgoingpath)
				if(route.outgoingtype === 'udp') {
					if(route.incomingip.length && route.incomingip !== remoteInfo.address) {
						next()
						return
					}
					const outgoingip = route.outgoingip.length ? route.outgoingip : remoteInfo.address
					const outgoingport = route.outgoingport.length ? route.outgoingport : localInfo.port
					logger.log('debug',`Sending UDP OSC message to ${outgoingip}:${outgoingport}`,{address: o.reverse(params), args: message.args})
					this.servers[sendersha].send(o.reverse(params), message.args, outgoingip, outgoingport);
					this.emit('outgoingpacket',uuid)
				} else {
					let stype = route.outgoingtype === 'tcpserver' ? 'clients' : 'server'
					logger.log('debug',`Sending TCP OSC message to ${stype}`,{address: o.reverse(params), args: message.args})
					this.servers[sendersha].send(o.reverse(params), message.args);
					this.emit('outgoingpacket',uuid)
				}

				next()
			}
		)
	}

	getSha(type,ip,port) {
		return sha256(type+ip+port);
	}
}
export default new Routes()