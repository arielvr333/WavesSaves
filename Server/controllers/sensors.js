const Sensor = require('../models/sensor_model')

const getSensors = async (req, res) => {
    try {
        sensors = await Sensor.find()
        res.status(200).send(sensors)
    } catch (err) {
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
    addNewSensor
}