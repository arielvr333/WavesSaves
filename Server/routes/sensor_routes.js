const express = require('express')
const router = express.Router()
const Sensor = require('../controllers/sensors')
const authenticate = require('../common/auth_middleware')

/**
* @swagger
* tags:
*   name: sensors
*   description: The sensors API
* components:
*   schemas:
*     sensor:
*       type: object
*       required:
*         - ip
*       properties:
*         ip:
*           type: string
*           description: The sensor ip
*         threshold:
*           type: int
*           description: The sensor threshold
*         standBy:
*           type: boolean
*           description: The sensor standBy mode
*         users:
*           type: array
*           description: The sensor users
*       example:
*         ip : 1.1.1.1
*         threshold: 3
*         standBy: false
*         users: ['Tomer', 'Ariel']
*     userCommand:
*       type: object
*       required:
*         - email
*         - sensorIp
*       properties:
*         email:
*           type: string
*           description: username
*         sensorIp:
*           type: string
*           description: The sensor ip
*       example:
*         email: "aaa@gmail.com"
*         sensor : 1.1.1.1
*     threshold:
*       type: object
*       required:
*         - ip
*         - threshold
*       properties:
*         ip:
*           type: string
*           description: the targeted sensor's IP.
*         threshold:
*           type: int
*           description: The targeted sensor new threshold.
*       example:
*         ip: "127.0.0.1"
*         threshold : 4
*     standBy:
*       type: object
*       required:
*         - ip
*         - standBy
*       properties:
*         ip:
*           type: string
*           description: the targeted sensor's IP
*         standBy:
*           type: bool
*           description: The sensor current standby mode
*       example:
*         ip: "127.0.0.1"
*         standBy : True
*     emailOnly:
*       type: object
*       required:
*         - email
*       properties:
*         email:
*           type: string
*           description: username
*       example:
*         email: "aaa@gmail.com"
*/

/**
* @swagger
* /sensor/getall:
*   post:
*     summary: get all sensors
*     description: get all the user sensors
*     tags: [sensors]
*     requestBody:
*       required: true
*       content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/emailOnly'
*     responses:
*       200:
*         description: The sensors list
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/sensor'
*     security:
*       - Authorization: []
*/
router.post('/getall', Sensor.getSensors)

/** @swagger
* /sensor/threshold:
*   post:
*     summary: update sensor's threshold value.
*     tags: [sensors]
*     requestBody:
*       required: true
*       content:
*         application/json:
*              schema:
*                   $ref: '#/components/schemas/threshold'
*     responses:
*       200:
*         description: ok
*     security:
*       - Authorization: []
*/

router.post('/threshold', authenticate, Sensor.updateThreshold)

/** @swagger
 * /sensor/standby:
 *   post:
 *     summary: update sensor's standby mode.
 *     tags: [sensors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *              schema:
 *                   $ref: '#/components/schemas/standBy'
 *     responses:
 *       200:
 *         description: ok
 *     security:
 *       - Authorization: []
 */


router.post('/standby', authenticate, Sensor.setStandByMode)

/**
* @swagger
* /sensor/add:
*   post:
*     summary: add new sensor
*     tags: [sensors]
*     requestBody:
*       required: true
*       content:
*         application/json:
*              schema:
*                   $ref: '#/components/schemas/userCommand'
*     responses:
*       200:
*         description: ok
*     security:
*       - Authorization: []
*/
router.post('/add', authenticate, Sensor.attachSensor)

/**
* @swagger
* /sensor/removeSensor:
*   post:
*     summary: remove sensor from user's list.
*     tags: [sensors]
*     requestBody:
*       required: true
*       content:
*         application/json:
*              schema:
*                   $ref: '#/components/schemas/userCommand'
*     responses:
*       200:
*         description: ok
*     security:
*       - Authorization: []
*/

router.post('/removeSensor', authenticate, Sensor.removeSensor)

router.post('/nameSensor', authenticate, Sensor.setSensorName)

module.exports = router