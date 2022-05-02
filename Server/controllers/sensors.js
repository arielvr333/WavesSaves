const Sensor = require('../models/sensor_model')
const User = require('../models/user_model')


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
        Sensor.updateOne({"_id": _ip}, {$set: {_threshold: threshold}}, function (err, doc) {
            res.status(200).send("ok")
        });
    }catch (err) {
        res.status(400).send({
            'status': 'fail',
            'error': err.message
        })
    }
}

const setStandByMode =  (req, res) => {
    const sensorIp = req.body.ip;
    const StandBy = req.body.standBy;
    try {
        Sensor.updateOne({"_id": sensorIp}, {$set: {_standBy: StandBy}}, function () {
            console.log("threshold")
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
        let sensors = await Sensor.findById(req.params.id)
        res.status(200).send(sensors)
    } catch (err) {
        res.status(400).send({
            'status': 'fail',
            'error': err.message
        })
    }
}

const attachSensor = async (req, res) => {
    try {
        let userName = req.body.email
        let sensorIp = req.body.sensor

        User.findOne({email: userName}, async function (err, doc) {
            if(!doc.sensorList.includes(sensorIp)) {
                doc.sensorList.push(sensorIp);
                await doc.save();
            }
        });

        Sensor.findOne({_id: sensorIp}, async function (err, doc) {
            if (!doc) {
                let newSensor = {
                    _id: sensorIp,
                    _users: [userName],
                    _threshold: 2,
                    _standBy: false
                }
                Sensor.create(newSensor, function () {
                    res.status(200).send("ok");
                });
            } else {
                if(!doc._users.includes(userName)) {
                    doc._users.push(userName);
                    await doc.save();
                }
                res.status(200).send("ok");
            }
        })
    } catch (err) {
        res.status(400).send({
            'status': 'fail',
            'error': err.message
        })
    }
}

const removeSensor = async (req, res) => {
    try {
        let userName = req.body.email
        let sensorIp = req.body.sensor
        await User.updateOne({email: userName}, {$pull: { sensorList: sensorIp }});
        await Sensor.updateOne({_id: sensorIp}, {$pull: { _users: userName }});
        res.status(200).send("ok")
    } catch (err) {
        res.status(400).send({
            'status': 'fail',
            'error': err.message
        })
    }
}

module.exports = {
    getSensors,
    getSensorById,
    attachSensor,
    updateThreshold,
    setStandByMode,
    removeSensor
}