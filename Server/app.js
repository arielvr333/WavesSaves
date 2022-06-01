const app = require('./server')

const port = process.env.PORT
app.listen(port, ()=> console.log('HTTP server is running on port ' + port))