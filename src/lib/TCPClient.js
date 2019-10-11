import SocketServer from './SocketServer.js'
import osc from 'osc'
import logger from './logger.js'

export default class TCPClient extends SocketServer {
	constructor(bind, port) {
		super(bind, port)

		this.ready = false
		this.bind = bind
		this.port = port
		this.type = 'tcpclient'

		this.client = new osc.TCPSocketPort({
			address: bind,
			port: port
		});

		this.client.on(
			"bundle",
			(oscBundle, timeTag, info) => {
				this.bundle(oscBundle, timeTag, {address: this.bind, port: this.port})
			}
		)

		this.client.on(
			"message",
			(message, timeTag, info) => {
				this.message(message, timeTag, {address: this.bind, port: this.port})
			}
		)

		this.client.on(
			"error",
			this.error.bind(this)
		)

		this.client.on(
			"ready",
			this.readyEvent.bind(this)
		)

		this.client.on(
			"raw",
			(data, info) => {
				this.raw(data, info, {address: this.bind, port: this.port})
			}
		)

		this.client.on(
			"close",
			() => {
				this.ready = false
			}
		)

		this.client.open();
	}

	getType() {
		return this.type
	}

	open() {
		this.client.open()
	}

	close() {
		this.client.close()
	}

	readyEvent() {
		this.ready = true
		logger.log('debug',`TCP Client is connected to ${this.bind}:${this.port}`)
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
		if(!this.ready) {
			console.warn("The server is not ready to send messages")
			return
		}
		this.client.send({
			address,
			args
		});
	}
}