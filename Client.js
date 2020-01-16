const net = require('net');        // Client Code  .
const client = net.createConnection({ port: 3000 }, () => { // once connected .
    console.log('connected to server!');

    process.stdin.on('data', (data) =>{
        client.write(data);
    })
});
client.on('data', (data) => {
    console.log("Msg from server: " + data.toString());
    // client.end();
});
client.on('end', () => {
    console.log('End of Message');
});