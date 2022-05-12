const app = require('../server')
const request = require('supertest')
const mongoosse = require('mongoose')
const User = require('../models/user_model')

const email = 'aaa@gmail.com'
const pwd ='123456'

beforeAll(done=>{
    User.deleteOne({'email' : email}, ()=>{
        done()
    })
})

afterAll(done=>{
    User.deleteOne({'email' : email}, ()=>{
        mongoosse.connection.close()
        done()
    })
})

describe('Testing Sensors API',()=>{
    const sensorIp = '127.0.0.1'
    let accessToken = ''

    test('test registration',async ()=>{
        const response = await request(app).post('/auth/register').send({
            'email' : email,
            'password':pwd,
            'firebaseToken': 'asdfghjhgfdsdfgh'
        })
        expect(response.statusCode).toEqual(200)
    })

    test('test login',async ()=>{
        const response = await request(app).post('/auth/login').send({
            'email' : email,
            'password':pwd,
            'firebaseToken': 'fbvzkjdkhbsfmdvfsbdgnfhgdbfs#$%#^HGDFSDZVDBG'
        })
        expect(response.statusCode).toEqual(200)
        accessToken = 'barer ' + response.body.accessToken
    })

    test('test add sensor',async ()=>{
        const response = await request(app).post('/sensor/add').send({
            'email' : email,
            "sensor" : sensorIp
        }).set({'Content-Type': 'application/json', 'Authorization': accessToken})
        expect(response.statusCode).toEqual(200)
    })

    test('test remove sensor',async ()=>{
        const response = await request(app).post('/sensor/removeSensor').send({
            'email' : email,
            "sensor" : sensorIp
        }).set({'Content-Type': 'application/json', 'Authorization': accessToken})
        expect(response.statusCode).toEqual(200)
    })

    test('test get all sensor',async ()=>{
        const response = await request(app).post('/sensor/getall').send({
            'email' : email
        }).set({'Content-Type': 'application/json', 'Authorization': accessToken})
        expect(response.statusCode).toEqual(200)
    })

    test('test new sensor threshold',async ()=>{
        const response = await request(app).post('/sensor/threshold').send({
            "ip" : sensorIp,
            "threshold" : 6
        }).set({'Content-Type': 'application/json', 'Authorization': accessToken})
        expect(response.statusCode).toEqual(200)
    })

    test('test sensor standBy mode update',async ()=>{
        const response = await request(app).post('/sensor/standby').send({
            "ip" : sensorIp,
            "standBy" : false
        }).set({'Content-Type': 'application/json', 'Authorization': 'barer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNmI2ZTM2YjdjN2IyZDg3YzE0NTJiMiIsImlhdCI6MTY1MTUxNjQ2MH0.3pFRNobR09lOJXy-Ghm7Ln2tte_xE-EnWqieD-tOCoU'})
        expect(response.statusCode).toEqual(200)
    })
})