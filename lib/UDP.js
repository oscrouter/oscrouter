import SocketServer from './SocketServer.js'
import osc from 'osc'
import logger from './logger.js'

export default class UDP extends SocketServer {
	constructor(bind, port) {
		super(bind, port)

		this.ready = false
		this.bind = bind
		this.port = port
		this.type = 'udp'

		this.server = new osc.UDPPort({
			localAddress: bind,
			localPort: port,
			metadata: true
		});

		this.server.on(
			"bundle",
			this.bundle.bind(this)
		)

		this.server.on(
			"message",
			this.message.bind(this)
		)

		this.server.on(
			"error",
			this.error.bind(this)
		)

		this.server.on(
			"ready",
			this.readyEvent.bind(this)
		)

		this.server.on(
			"raw",
			this.raw.bind(this)
		)

		this.server.on(
			"close",
			() => {
				this.ready = false
			}
		)

		this.open()
	}

	getType() {
		return this.type
	}

	open() {
		this.server.open()
	}

	close() {
		this.server.close()
	}

	readyEvent() {
		this.ready = true
		logger.log('debug',`UDP Server is listening on ${this.bind}:${this.port}`)
	}

	error(err) {
		console.error(err)
	}

	raw(data, info) {
		this.emit('raw', data, info, {address: this.bind, port: this.port}, this.type)
	}

	bundle(oscBundle, timeTag, info) {
		this.emit('bundle',oscBundle, timeTag, info, {address: this.bind, port: this.port}, this.type)
	}

	message(message, timeTag, info) {
		this.emit('message',message, timeTag, info, {address: this.bind, port: this.port}, this.type)
	}

	send(address, args, host, port) {
		if(!this.ready) {
			console.warn("The server is not ready to send messages")
			return
		}
		this.server.send({
			address,
			args
		}, host, port);
	}
}