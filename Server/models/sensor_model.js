const mongoose = require("mongoose")

const sensorSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    _users: {
        type: Array,
        required: false
    },
    _threshold: {
        type: String,
        required: true
    },
    _standBy: {
        type: Boolean,
        required: true
    },
})

module.exports = mongoose.model('sensors', sensorSchema)