const io = require('socket.io')()
const port = 1337
io.listen(port)
console.log('Listening on port ' + port + '...')

io.on('connection', function (socket) {
	console.log("connection!");

	socket.on('apply', function(data) {
		console.log(data)
	})
})