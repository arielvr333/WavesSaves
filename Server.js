const udp = require('dgram');
const server = udp.createSocket('udp4');


server.on('error',function(error){
    console.log('Error: ' + error);
//    server.close();
});

server.on('message',function(msg,info){
    console.log('Data received from client : ' + msg.toString());
    server.send("Got Your message",info.port,'localhost');
    if(info.address === "192.168.1.18")
        server.send("Alert",info.port,'192.168.1.14');
});

server.on('listening',function(){
    let address = server.address();
    let port = address.port;
    let ipaddr = address.address;
    console.log('Server is listening at port ' + port);
    console.log('Server ip :' + ipaddr);

});

server.on('close',function(){
    console.log('Socket is closed !');
});

server.bind(20001, "192.168.1.18");

setTimeout(function(){
    server.close();
},15000);