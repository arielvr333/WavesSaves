const app = require('../server')
const request = require('supertest')
const mongoosse = require('mongoose')
const User = require('../models/user_model')

const email = 'aaa@gmail.com'
const pwd = '123456'

beforeAll(done=>{
    User.deleteOne({'email' : email}, ()=>{
        done()
    })
})

afterAll(done=>{
    User.deleteOne({'email' : email}, ()=>{
        mongoosse.connection.close()
        app.server.close()
        done()
    })
})


describe('Testing Auth API',()=>{

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
    })
})