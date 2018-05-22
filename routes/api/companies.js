const config = require('../../config')
const expjwt = require('express-jwt')
const sha256 = require('sha256')

const db = require('monk')(config.database)
const companies = db.get('companies')

var form = require('express-form'),
    field = form.field

/*
 * GET /api/companies
 */
const find = (req, res) => {
  companies
    .find({})
    .then((cmpns) => { res.json(cmpns) })
}

/*
 * GET /api/companies/:id
 */
const findOne = (req, res) => {
  companies
    .findOne({ _id: req.params.id })
    .then((company) => { res.json(company) })
}

/*
 * POST /api/companies
 */
const create = (req, res) => {
  if (!req.form.isValid) {
    res.json({
      success: false,
      message: req.form.errors
    })
  } else {
    companies.insert({
      name: req.form.name,
      address: req.form.address,
      telephone: req.form.telephone,
      description: req.form.description,
      popularity: req.form.popularity
    })
    res.json({ success: true })
  }
}

/*
 * DELETE /api/companies/:id
 */
const remove = (req, res) => {
  companies
    .findOneAndDelete({ _id: req.params.id })
    .then((user) => {
      res.json({ success: true })
    })
}

/*
 * DELETE /api/companies
 */
const removeAll = (req, res) => {
  companies.remove({})
  res.json({ success: true })
}

var router = require('express').Router()
router.get('/', find)
router.get('/:id', findOne)
router.post('/', expjwt({ secret: config.secret }),
  form(
    field('name').trim().required().is(/^[\w\s]+$/),
    field('telephone').trim().required().is(/^[0-9\s-]+$/),
    field('description').trim(),
    field('address').trim().required(),
    field('popularity').trim().required()
  ),
  create)
router.delete('/:id', expjwt({ secret: config.secret }), remove)
router.delete('/', expjwt({ secret: config.secret }), removeAll)

module.exports = router