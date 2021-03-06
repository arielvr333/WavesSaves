const User = require('../models/user_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const sendError = (res,code,msg)=>{
    return res.status(code).send({
        'status': 'fail',
        'error': msg
    })
}

const register = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const token = req.body.firebaseToken
    let newUser;
    try {
        const doc = await User.findOne({'email': email});
        if (doc != null) {
            return res.status(400).send({
                'status': 'fail',
                'error': 'user exists'
            })
        } else {
            const salt = await bcrypt.genSalt(10)
            const hashPwd = await bcrypt.hash(password, salt)

            const user = User({
                'email': email,
                'password': hashPwd,
                'firebaseToken': token,
                'sensorList': []
            })
            newUser = await user.save();
            res.status(200).send(newUser)
        }

    } catch (err) {
        res.status(400).send({
            'status': 'fail',
            'error': err.message
        })
    }
}


const login = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const token = req.body.firebaseToken
    if (email == null || password == null) return sendError(res,400,'wrong email or password')
    
    try{
        const user = await User.findOne({'email' : email })
        if (user == null) return sendError(res,400,'wrong email or password')

        const match = await bcrypt.compare(password, user.password)
        if (!match) return sendError(res,400,'wrong email or password')

        const accessToken = await jwt.sign(
            {'id':user._id},
            process.env.ACCESS_TOKEN_SECRET)
        await User.updateOne({'email' : email},{$set:{firebaseToken: token}});
        res.status(200).send({'accessToken' : accessToken})

    }catch(err){
        return sendError(res,400,err.message)
    }

}

const logout = async (req, res) => {
    const username = req.body.email;
    try {
        User.updateOne({"email": username}, {$set: {firebaseToken: ""}}, function () {
            res.status(200).send("ok")
        });
    }
    catch (err) {
        res.status(400).send({
            'status': 'fail',
            'error': 'error: ' + err
        })
    }
}

module.exports = {
    login,
    register,
    logout
}