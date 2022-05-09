const express = require('express')
const router = express.Router()

const Auth = require('../controllers/auth')

/**
 * @swagger
 * tags:
 *   name: user
 *   description: The users API
 */

/**
* @swagger
* components:
*   schemas:
*     user:
*       type: object
*       required:
*         - email
*         - password
*         - firebaseToken
*       properties:
*         email:
*           type: string
*           description: The user email
*         password:
*           type: string
*           description: The user password
*         sensorList:
*           type: array
*           description: The user sensors
*         firebaseToken:
*          type: string
*          description: the user current FireBase token
*       example:
*         email : "aaa@gmail.com"
*         password: '123456'
*         sensorList: ['11.1.1.1', '1.2.3.4']
*         firebaseToken: 'slfjadpohkbfnmmdnmadsfhdngbafdA'
*     register:
*       type: object
*       required:
*         - email
*         - password
*         - firebaseToken
*       properties:
*         email:
*           type: string
*           description: The user email.
*         password:
*           type: string
*           description: The user password.
*         firebaseToken:
*           type: string
*           description: The user's phone firebase token.
*       example:
*         email : "aaa@gmail.com"
*         password: '123456'
*         firebaseToken: "ohdbwnvjl#idbhkfnlvkjfwbnsvkjskbnmfs"
*/

router.post('/login', Auth.login)

/**
* @swagger
* /auth/login:
*   post:
*     tags: [user]
*     requestBody:
*       required: true
*       content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/register'
*     responses:
*       200:
*         description: ok
*/

router.post('/register', Auth.register)

/**
* @swagger
* /auth/register:
*   post:
*     tags: [user]
*     requestBody:
*       required: true
*       content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/register'
*     responses:
*       200:
*         description: ok
*/

router.post('/logout', Auth.logout)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [user]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/emailOnly'
 *     responses:
 *       200:
 *         description: ok
 */

module.exports = router