const fhonebookRouter = require('express').Router()
const Person = require('../models/person')
const logger = require('../utils/logger')

fhonebookRouter.get('/', (request, response, next) => {
  Person.find({})
    .then(people => {
      const peopleFront = people.map(p  => ({name: p.name, number: p.number, id: p._id,}))
      response.json(peopleFront)
    })
    .catch(error => next(error))
})

fhonebookRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id
  logger.info('persons', id)
  Person.findById(id)
  .then(person => {
    if (person) {
      const personFront = {
        name: person.name,
        number: person.number,
        id: person._id,
      }
      response.json(personFront)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

fhonebookRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(person => {
      if (person) {
        logger.info(`Person ${id} deleted`)
        response.statusMessage = `The person with id ${id} was deleted`
        response.status(204).end()
      } else {
        response.statusMessage = `No person has been found with id ${id}`
        response.status(404).end()
      }
    })
    .catch(error => {
      logger.info(error)
      next(error)
    })
})

fhonebookRouter.post('/', (request, response, next) => {
  const body = request.body
  if (!body) {
    return response.status(400).json({
      error: 'No body send'
    })
  } else if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'In order to register, the name and number are required.'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save()
    .then(result => {
      logger.info(`Added ${result.name} number ${result.number} to phonebook`)

      const personResponse = {
        name: body.name,
        number: body.number,
        id: result._id.toString()
      }
      response.json(personResponse)
    })
    .catch(error => next(error))
})

fhonebookRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const id = request.params.id

  if (!body.number) {
    return response.status(400).json({
      error: 'In order to update, the number is required.'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    _id: id
  })

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

module.exports = fhonebookRouter