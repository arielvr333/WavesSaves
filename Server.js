const udp = require('dgram');
const server = udp.createSocket('udp4');


server.on('error',function(error){
    console.log('Error: ' + error);
//    server.close();
});

server.on('message',function(msg,info){
    console.log('Data received from client : ' + msg.toString());
    if(info.address === '192.168.1.26')
    {
    server.send("Got Your message",info.port,info.address);
    var cee = info.address;
    console.log('in if 1  ' +info.address);
    }
    
    if(info.address === '192.168.1.29')
    {
        server.send("Alert",info.port,cee);
        console.log('in if 2  ' +info.address);
    }
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
},20000);
