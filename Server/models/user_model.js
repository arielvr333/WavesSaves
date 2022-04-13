const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firebaseToken: {
        type: String,
        required: true
    },
    sensorList: {
        type: Array,
        required: false
    }
})

module.exports = mongoose.model('users', userSchema)