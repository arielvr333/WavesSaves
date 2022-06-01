const Sensor = require('../models/sensor_model')
const User = require('../models/user_model')


const getSensors = async (req, res) => {
    try {
        const _email = req.body.email;
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
    try {
    const _ip = req.body.ip;
    const threshold = req.body.threshold;
        Sensor.updateOne({"_id": _ip}, {$set: {_threshold: threshold}}, function () {
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
    try {
        const sensorId = req.body.ip;
        const StandBy = req.body.standBy;
        Sensor.updateOne({"_id": sensorId}, {$set: {_standBy: StandBy}}, function () {
            res.status(200).send("ok")
        });
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
        let sensorId = req.body.sensor

        User.findOne({email: userName}, async function (err, doc) {
            if(!doc.sensorList.includes(sensorId) || (doc.sensorList.length === 0)) {
                doc.sensorList.push(sensorId);
                await doc.save();
            }
        });

        Sensor.findOne({_id: sensorId}, async function (err, doc) {
            if (!doc) {
                let newSensor = {
                    _id: sensorId,
                    _users: [userName],
                    _threshold: 5,
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
        let sensorId = req.body.sensor
        await User.updateOne({email: userName}, {$pull: {sensorList: sensorId}});
        await Sensor.updateOne({_id: sensorId}, {$pull: {_users: userName}});
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
    attachSensor,
    updateThreshold,
    setStandByMode,
    removeSensor
}