const config = require('../../config')
const sha256 = require('sha256')

const db = require('monk')(config.database)
const users = db.get('users')

var route = require('express').Router(),
    form = require('express-form'),
    field = form.field

/*
 * GET /api/users
 */
const find = (req, res) => {
  users
    .find({})
    .then((usrs) => { res.json(usrs) })
}

/*
 * POST /api/users
 */
const create = (req, res) => {
  if (!req.form.isValid) {
    res.json({
      success: false,
      message: req.form.errors
    })
  } else {
    users.insert({
      name: req.form.name,
      email: req.body.email,
      password: sha256(req.body.password)
    })
    res.json({ success: true })
  }
}

/*
 * DELETE /api/users/:id
 */
const remove = (req, res) => {
  users
    .findOneAndDelete({ _id: req.params.id })
    .then((user) => {
      res.json({ success: true })
    })
}

/*
 * DELETE /api/users
 */
const removeAll = (req, res) => {
  users.remove({})
  res.json({ success: true })
}

route.get('/', find)
route.post('/',
  form(
    field('name').trim().required(),
    field('email').trim().required().is(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
    field('password').trim().required()
  ),
  create)
route.delete('/:id', remove)
route.delete('/', removeAll)

module.exports = route