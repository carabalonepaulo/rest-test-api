const config = require('../config')
const expjwt = require('express-jwt')
const jwt = require('jsonwebtoken')
const sha256 = require('sha256')

const db = require('monk')(config.database)
const users = db.get('users')

const express = require('express')
var form = require('express-form'),
    field = form.field

/**
 * POST /api/authenticate
 */
const authenticate = (req, res) => {
  if (!req.form.isValid) {
    res.json({
      success: false,
      message: req.form.errors
    })
  } else {
    users
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          res.json({
            success: false,
            message: 'authentication failed'
          })
        } else {
          if (user.password != sha256(req.form.password)) {
            res.json({
              success: false,
              message: 'authentication failed'
            })
          } else {
            var token = jwt.sign({
              name: user.name,
              email: user.email
            }, config.secret, { expiresIn: '1h' });

            res.json({
              success: true,
              token: token
            })
          }
        }
      })
    }
}

var router = express.Router()
router.use('/users', expjwt({ secret: config.secret }), require('./api/users'))
router.use('/companies', require('./api/companies'))

router.post('/authenticate',
  form(
    field('email').trim().required().is(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
    field('password').trim().required()
  ),
  authenticate)


module.exports = router