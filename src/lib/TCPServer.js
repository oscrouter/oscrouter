import SocketServer from './SocketServer.js'
import osc from 'osc'
import net from 'net'
import uuidv4 from 'uuid/v4';
import each from 'async/each';
import logger from './logger.js'

export default class TCPServer extends SocketServer {
	constructor(bind, port) {
		super(bind, port)

		this.ready = false
		this.bind = bind
		this.port = port
		this.type = 'tcpserver'
		this.clients = []

		this.netServer = net.createServer((socket) => {
			const uuid = uuidv4()
			const client = new osc.TCPSocketPort({
				socket: socket
			});

			logger.log('debug',`TCP Client connected to ${this.bind}:${this.port}`)

			client.on(
				"close",
				() => {
					logger.log('debug',`TCP Client disconnected from ${this.bind}:${this.port}`)
					delete(this.clients[uuid])
				}
			)

			client.on(
				"ready",
				() => {
					this.clients[uuid] = client
				}
			)

			client.on(
				"message",
				(message, timeTag, info) => {
					this.message(message, timeTag, {address: socket.remoteAddress, port: socket.remotePort})
				}
			)

			client.on(
				"bundle",
				(oscBundle, timeTag, info) => {
					this.bundle(oscBundle, timeTag, {address: socket.remoteAddress, port: socket.remotePort})
				}
			)


			client.on(
				"error",
				this.error.bind(this)
			)

			client.on(
				"raw",
				(data, info) => {
					this.raw(data, info, {address: socket.remoteAddress, port: socket.remotePort})
				}
			)

		});
		this.open();
	}

	getType() {
		return this.type
	}

	open() {
		this.netServer.listen(this.port, this.bind, () => {
			this.ready = true
			logger.log('debug',`TCP Server is listening on ${this.bind}:${this.port}`)
		});
	}

	close() {
		this.netServer.close()
	}

	error(err) {
		console.error(err)
	}

	raw(data, info) {
		this.emit('raw', data, info, {address: this.bind, port: this.port}, this.type)
	}

	bundle(oscBundle, timeTag, info) {
		this.emit('bundle', oscBundle, timeTag, info, {address: this.bind, port: this.port}, this.type)
	}

	message(message, timeTag, info) {
		this.emit('message', message, timeTag, info, {address: this.bind, port: this.port}, this.type)
	}

	send(address, args) {
		each(
			this.clients,
			(client, next) => {
				client.send({
					address,
					args
				});
				next();
			}
		)
	}
}