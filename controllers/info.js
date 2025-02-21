const infoRouter = require('express').Router()
const Person = require('../models/person')

infoRouter.get('/', (request, response, next) => {
  Person.find({})
    .then(people => {
      const date = new Date().toString()
      response.send(`<p>Phonebook has info on ${people.length} people</p><p>${date})</p>`)
    })
    .catch(error => next(error))
})


module.exports = infoRouter