const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const request = require('request');
const udp = require('dgram');
const server = udp.createSocket('udp4');
const assert = require("assert");

// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("WavesSavesDataBase");
//     dbo.dropDatabase(function (err, result) {
//         if (err) throw err;
//     });
//     dbo.createCollection("users", function (err, res) {
//         if (err) throw err;
//     });
//     dbo.createCollection("sensors", function (err, res) {
//         if (err) throw err;
//     });
// });



if (process.env.NODE_ENV == "development") {
    const swaggerUI = require("swagger-ui-express")
    const swaggerJsDoc = require("swagger-jsdoc")
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Node Demo API",
                version: "1.0.0",
                description: "A simple Express Library API",
            },
            servers: [{url: "http://localhost:" + process.env.PORT,},],
        },
        apis: ["./routes/*.js"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
 }
 


app.use(bodyParser.urlencoded({extended:true, limit: '1m'}))
app.use(bodyParser.json())

mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser : true})
const db = mongoose.connection
db.on('error',error=>{console.error(error)})
db.once('open',()=>{console.log('db connected!')})

const port = process.env.PORT

const indexRouter = require('./routes/index')
app.use('/',indexRouter)

const sensorRouter = require('./routes/sensor_routes')
app.use('/sensor',sensorRouter)

const authRouter = require('./routes/auth_routes')
const Module = require("module");
app.use('/auth',authRouter)

module.exports = app







////////////////////////////////////////////////////////////// old server/////////////////////////////////////////////////////////////////////////


server.on('error',function(error){
    console.log('Error: ' + error);
});

server.on('message',function(msg,info) {
    let message = msg.toString();
    console.log('Data received from client : ' + message);
    const splitMessage = message.split(',');
    console.log(splitMessage);
    const command = splitMessage[0];
    console.log('command: ' + command);
    switch (command) {
        case 'sensor'://"sensor"
            console.log('switch case sensor statement');
            sensorinit(info);
            break;
        case 'alert'://alert
            alertHandler(info)
            console.log('switch case alert data statement');
            break
        default:
            console.log('default statement');
            server.send("bad command", info.port, info.address);
    }
});

server.on('listening',function(){
    let address = server.address();
    let port = address.port;
    let ipaddr = address.address;
    console.log('Udp Server is listening at port ' + port);
    console.log('Udp Server ip :' + ipaddr);

});
//
// server.on('close',function(){
//     console.log('Server is closed !');
// });

server.bind(20001, "127.0.0.1");
//server.bind(20001, "0.0.0.0");
function SendMessage(message,port,address)
{
    console.log(message,port, address);
    server.send(message,port, address);
}

function attachSensor(info,sensorIp)
{
    MongoClient.connect(url, function (err, db) {
        const dbo = db.db("WavesSavesDataBase");
        dbo.collection('users').findOne({_id: info.address},function (err, doc) {
            doc._sensorList.push(sensorIp)
            dbo.collection('users').updateOne({"_ip": info.address,}, {$set: {_sensorList: doc._sensorList}}, function (err) {
                assert.equal(null, err);
            });
        });

        dbo.collection('sensors').findOne({_id: sensorIp},function (err, doc) {
            if (!doc) {
                server.send("no sensor activated", info.port, info.address);
            }
            else
                doc._users.push(info.address);
            dbo.collection('users').updateOne({"_ip": info.address,}, {$set: {_sensorList: doc._sensorList}}, function (err) {
                assert.equal(null, err);
            });
            server.send("ok", info.port, info.address);
        });
    });
}

function sensorinit(info){
    const sensor={
         _id: info.address,
        //_id: "127.0.0.3",
        _users: [],
        _threshold: 2,
        _standBy: false
    }
    //MongoClient.connect(url, function (err, db) {
     //   assert.equal(null, err);
     //   const dbo = db.db("WavesSavesDataBase");
        db.collection('sensors').findOne({_id: sensor._id},async function (err, doc) {
            if (!doc) {
                console.log("eyal")
                db.collection('sensors').insertOne(sensor, function (res) {
                    server.send("threshold " + sensor._threshold, info.port, info.address,sensor._standBy)
                });
            } else
                server.send("threshold " + doc._threshold, info.port, info.address,doc._standBy);
        });
   // });
}
function alertHandler(info) {
    const token = "";
    const payload = createPayLoad(token);
    request.post({ headers: {'content-type' : 'application/json', "Authorization": process.env.FIREBASE_TOKEN}, url: "https://fcm.googleapis.com/fcm/send", body: payload});
    server.send("sent to phone", info.port, info.address)
}

function createPayLoad(token){
    let payload = {
        to: "esF2EDkpSb6jMnXMrr8tRq:APA91bHtvG1D8tFAwpzLQ72mt0aDiNKWmw9eL2ITLCSMuE4trTs4oJoHIOqMEbANhrcYoLehi1J2bq58stHAxNl0Q3ayAortZMfEHFYdPSJ_YYqsF5tbN37aOQlfF4nq0qYqYgXj0TW1",
        data: {
            sound: "alarm.mp3",
            title: "ALERT",
            body: "ALERT",
            content_available: true,
            priority: "high"
        }
    }
    return JSON.stringify(payload)
}


exports.SendMessage = SendMessage;