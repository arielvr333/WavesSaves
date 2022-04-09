const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.send('Hello-WavesSaves')
})

module.exports = router