const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
app.use(express.json())

// app.use(morgan('tiny'))    // middleware
morgan.token('bodyEmTexto', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :bodyEmTexto', {
    skip: (req) => req.method !== 'POST',
  })
)
app.use(express.static('dist'))
app.use(cors())

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    console.error('Error type: CastError')
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    console.error('Error type: ValidationError')
    return response.status(400).json({ error: 'The name must be greater than 3 characters and the number greater than 5' })
  } else {
    console.error('Error type: other')
    console.error(error.message)
  }

  next(error)
}


mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGODB_URI)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 5,
    required: true
  },
})
const Person = mongoose.model('Person', personSchema)

app.get('/info', (request, response, next) => {
  Person.find({})
    .then(people => {
      const date = new Date().toString()
      response.send(`<p>Phonebook has info on ${people.length} people</p><p>${date})</p>`)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(people => {
      const peopleFront = people.map(p  => ({name: p.name, number: p.number, id: p._id,}))
      response.json(peopleFront)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', async (request, response, next) => {
  const id = request.params.id
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

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(person => {
      if (person) {
        console.log(`Person ${id} deleted`)
        response.statusMessage = `The person with id ${id} was deleted`
        response.status(204).end()
      } else {
        response.statusMessage = `No person has been found with id ${id}`
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
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
      console.log(`Added ${result.name} number ${result.number} to phonebook`)
      
      const personResponse = {
        name: body.name,
        number: body.number,
        id: result._id.toString()
      }
      response.json(personResponse)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
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

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`O servidor está a escoitar no porto ${PORT}`);
})