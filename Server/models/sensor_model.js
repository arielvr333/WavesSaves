const mongoose = require("mongoose")

const sensorSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('sensors', sensorSchema)