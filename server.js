// dependencies
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const morgan = require('morgan')

// express
var app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))

// routes
app.use('/api', require('./routes/api'))

// start server
app.listen(8080)

// fix: https://github.com/remy/nodemon/issues/1025
process.on('SIGINT', () => { process.exit() })