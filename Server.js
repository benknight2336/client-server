
var net = require('net');
var sockets = [];

var guestId = 0;

var serverPassword = 'serverpassword';

var server = net.createServer(function(socket) {
	// Increment
	guestId++;
	
	socket.nickname = "Guest" + guestId;
	var clientName = socket.nickname;

	sockets.push(socket);

	// Log it to the server output
	console.log(clientName + ' joined this chat.');

	// Welcome user to the socket
	socket.write("Welcome to the chat!\n");

	// Broadcast to others excluding this socket
	broadcast(clientName, clientName + ' joined this chat.\n');


	// When client sends data
	socket.on('data', function(bufferData) {
		var	data = bufferData.toString();
		var message = clientName + ': ' + data;

		// inspect the data and check for all possible values - maybe a case statement
		if(/\/username/.test(data)) {
			changeUsername(clientName, socket, data);
			
		} else if(/\/clientlist/.test(data)) {
			broadcastClientList(data);

		} else if(/\/w/.test(data)) {

		} else if (/\/kick/.test(data)){
			kickUser(data, socket)
			
		} else {
			broadcast(clientName, message);
			// Log it to the server output
			process.stdout.write(message);
		}

	});


	// When client leaves
	socket.on('end', function() {

		var message = clientName + ' left this chat\n';

		// Log it to the server output
		process.stdout.write(message);

		// Remove client from socket array
		removeSocket(socket);

		// Notify all clients
		broadcast(clientName, message);
	});


	// When socket gets errors
	socket.on('error', function(error) {

		console.log('Socket got problems: ', error.message);

	});
});

function broadcastClientList(data) {
	data = "";
	// loop through sockets
	sockets.forEach(function(socket, index, array){
		data += `${socket.nickname} `;
	})
	// for(var socket in sockets) {
	// 	console.log("THis is a socket:", typeof socket)
	// 	data += socket.nickname + " "
	// }
	var message = "The users connected are: " + data;
	broadcastToAll(message);
	// Log it to the server output
	process.stdout.write(message);
}

function kickUser(data, socket) {
	// name of the user that we want to kick
	let username = data.split(/\s+/)[1];
	console.log("THis is the username:", username)
	let password = data.split(/\s+/)[2];
	if (password === serverPassword) {
		let userExists = true;
		sockets.forEach(function(kicksocket, index, array){
			console.log("loop socket:", JSON.stringify(kicksocket))
			if (kicksocket.nickname === username) {
				console.log("REMOVED:", kicksocket.nickname)
				removeSocket(kicksocket)
				kicksocket.write("You have been kicked from chat.");
				// var message = username + ' left this chat\n';
				// broadcastToAll(message);
				// Log it to the server output
				// process.stdout.write(message);
				kicksocket.end();
			} else {
				userExists = false;
			}
		})
		if (userExists == false) {
			socket.write("This user does not exist.");
			userExists = true;
		}
	} else {
		// broadcast message: incorrect password
		socket.write('Incorrect Password');
	}


}

function changeUsername(clientName, socket, data) {
	let newName = data.split(/\s+/)[1];
	let oldName = clientName;
	clientName = newName;
	socket.nickname = newName;
	var message = `${oldName}'s name has been changed to: ${clientName}\n`;
	broadcastToAll(message);
	// Log it to the server output
	process.stdout.write(message);
}


// Broadcast to Everyone
function broadcastToAll(message) {

	// If there are no sockets, then don't broadcast any messages
	if (sockets.length === 0) {
		process.stdout.write('Everyone left the chat');
		return;
	}

	// If there are clients remaining then broadcast message
	sockets.forEach(function(socket, index, array){
		// Dont send any messages to the sender
		socket.write(message);
	});
	
};

// Broadcast to others, excluding the sender
function broadcast(from, message) {

	// If there are no sockets, then don't broadcast any messages
	if (sockets.length === 0) {
		process.stdout.write('Everyone left the chat');
		return;
	}

	// If there are clients remaining then broadcast message
	sockets.forEach(function(socket, index, array){
		// Dont send any messages to the sender
		if(socket.nickname === from) return;
		
		socket.write(message);
	
	});
	
};

// Remove disconnected client from sockets array
function removeSocket(socket) {

	sockets.splice(sockets.indexOf(socket), 2);

};


// Listening for any problems with the server
server.on('error', function(error) {

	console.log("So we got problems!", error.message);

});


server.listen(3000, () => {
    console.log('server is up');
});

