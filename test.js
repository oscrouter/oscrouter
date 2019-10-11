const { Routes } = require('./dist/index');

const eachOfSeries = require('async/eachOfSeries');
const allRoutes = {
	"9cb5d8de-5f9d-46ae-b62c-b64425954500": {
		"label": "hi",
		"incomingtype": "udp",
		"incomingip": "",
		"incomingport": "53000",
		"incomingpath": "/eos/out/event/cue/1/:cue/fire",
		"incomingmin": "",
		"incomingmax": "",
		"outgoingtype": "udp",
		"outgoingip": "192.168.1.39",
		"outgoingport": "53000",
		"outgoingpath": "/cue/:cue/start",
		"outgoingmin": "",
		"outgoingmax": ""
	},
	"9cb5d8de-5f9d-46ae-b62c-b64425954501": {
		"label": "hi",
		"incomingtype": "udp",
		"incomingip": "",
		"incomingport": "53000",
		"incomingpath": "/eos/out/event/cue/1/:cue/fire",
		"incomingmin": "",
		"incomingmax": "",
		"outgoingtype": "udp",
		"outgoingip": "192.168.1.40",
		"outgoingport": "53000",
		"outgoingpath": "/cue/:cue/start",
		"outgoingmin": "",
		"outgoingmax": ""
	}
}
	;

loadRoutes(allRoutes)

function loadRoutes(routes) {
	eachOfSeries(
		routes,
		(val, key, next) => {
			Routes.addRoute(key, val)
			next();
		}
	)
}


Routes.on('outgoingpacket', (uuid) => {
	console.log('Packet out')
})

Routes.on('incomingpacket', (uuid) => {
	console.log('Packet in')
})