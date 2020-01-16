const net = require('net');  // Server Code .
const server = net.createServer((socket) => {
    console.log('Welcome to Echo Server\r\n');
    socket.setEncoding('utf8');
    socket.on('data', (chunk) => {
        socket.write(chunk);
        console.log('Msg from client: ' + chunk)
    });
    socket.on('end', socket.end);
});
server.listen(3000, () => {
    console.log('server is up');
});