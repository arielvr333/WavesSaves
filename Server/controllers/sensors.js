const Sensor = require('../models/sensor_model')
const User = require('../models/user_model')
const Server = require('../server')


const getSensors = async (req, res) => {
    const _email = req.body.email;
    try {
        let specificUser = await User.findOne({email: _email});
        Sensor.find({_id: {$in: specificUser.sensorList}}, function (err, doc) {
            doc = doc.map(u => ({_id: u._id, _threshold: u._threshold, _standBy: u._standBy}));
            res.status(200).send(doc)
        });
    }catch (err) {
        res.status(400).send({
            'status': 'fail',
            'error': err.message
        })
    }
}

const updateThreshold =  (req, res) => {
    const _ip = req.body.ip;
    const threshold = req.body.threshold;
    try {
        Sensor.updateOne({"_ip": _ip}, {$set: {_threshold: threshold}}, function (err, doc) {
         //       Server.server.send("threshold " + threshold, Server.port, _ip);
            res.status(200).send("ok")
        });
    }catch (err) {
        res.status(400).send({
            'status': 'fail',
            'error': err.message
        })
    }
}

const getSensorById = async (req, res) => {
    try {
        sensors = await Sensor.findById(req.params.id)
        res.status(200).send(sensors)
    } catch (err) {
        res.status(400).send({
            'status': 'fail',
            'error': err.message
        })
    }
}

const addNewSensor = (req, res) => {
    console.log('addNewSensor ' + req.body.message)
    sender = req.user.id


    //todo: change  data
    const sensor = Sensor({
        message: req.body.message,
        sender: sender
    })

    sensor.save((error, newSensor) => {
        if (error) {
            res.status(400).send({
                'status': 'fail',
                'error': error.message
            })
        } else {
            res.status(200).send(newSensor)
        }
    })
}

module.exports = {
    getSensors,
    getSensorById,
    addNewSensor,
    updateThreshold
}