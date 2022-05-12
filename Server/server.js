const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const request = require('request');
const udp = require('dgram');
const server = udp.createSocket('udp4');
let activeSensors = new Map();

if (process.env.NODE_ENV === "development") {
    const swaggerUI = require("swagger-ui-express")
    const swaggerJsDoc = require("swagger-jsdoc")
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "WavesSaves API",
                version: "1.0.0",
                description: "WavesSaves API",
            },
            components: {
                securitySchemes: {
                    Authorization: {
                        type: 'apiKey',
                        in: 'header',
                        name: 'Authorization'
                    }
                }
            },
            security: {
                Authorization: []
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
app.use('/auth',authRouter)

module.exports = app

server.on('error',function(error){
    console.log('Error: ' + error);
});

server.on('message',function(msg,info) {
    const splitMessage = msg.toString().split(',');
    const command = splitMessage[0];
    switch (command) {
        case 'alert'://alert
            alertHandler(info).then(() => console.log('alert sent'))
            break
        case 'status':
            sendStatus(info);
            break
        default:
            console.log('default statement');
    }
});

server.on('listening',function(){
    let address = server.address();
    console.log('Udp Server is listening at port ' + address.port);
    console.log('Udp Server ip :' + address.address);
});

server.bind(20001, "127.0.0.1");
//server.bind(20001, "0.0.0.0");

async function alertHandler(info) {
    let sensor = await db.collection('sensors').findOne({_id: info.address})
    for (let i = 0; i < sensor._users.length; i++) {
        db.collection('users').findOne({email: sensor._users[i]}, function (err, doc) {
            const payload = createPayLoad(doc.firebaseToken);
            request.post({
                headers: {'content-type': 'application/json', "Authorization": process.env.FIREBASE_TOKEN},
                url: "https://fcm.googleapis.com/fcm/send",
                body: payload
            });
        });
        server.send("sent", info.port, info.address)
    }
}
function createPayLoad(token){
    let payload = {
        to: token,
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

function sendStatus(info){
    db.collection('sensors').findOne({_id: info.address},async function (err, doc) {
        if (!doc) {
            let sensor={
                _id: info.address,
                _users: [],
                _threshold: 2,
                _standBy: false
            }
            db.collection('sensors').insertOne(sensor, function () {
                server.send(sensor._threshold + " " + sensor._standBy, info.port, info.address)
            });
        } else
            server.send( doc._threshold + " " + doc._standBy, info.port, info.address);
        activeSensors.set(info.address, Date.now().toString());
    });
}

setInterval(function () {
    for (let entry of activeSensors.entries()) {
        if ((Date.now() - 5000) > entry[1]) {
            let ip = entry[0]
            activeSensors.delete(ip);
            sendPushNotification(ip).then(() => console.log(ip + " disconnected"))
        }
    }
}, 5000);

async function sendPushNotification(ip) {
    let sensor = await db.collection('sensors').findOne({_id: ip})
    for (let i = 0; i < sensor._users.length; i++) {
        db.collection('users').findOne({email: sensor._users[i]}, function (err, doc) {
            const payload = createPushPayLoad(doc.firebaseToken, ip);
            request.post({
                headers: {'content-type': 'application/json', "Authorization": process.env.FIREBASE_TOKEN},
                url: "https://fcm.googleapis.com/fcm/send",
                body: payload
            });
        });
    }
}
function createPushPayLoad(token, ip){
    let payload = {
        to: token,
        notification: {
            title: 'חיישן נותק!',
            body: 'חיישן ' + ip + ' התנתק מהרשת'
        }
    }
    return JSON.stringify(payload)
}
