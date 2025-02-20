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

mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGODB_URI)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

app.get('/info', (request, response) => {
  const date = new Date().toString()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date})</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(people => {
      response.json(people)
    })
    .catch(error => {
      console.log(error)
      next(error)
    })
})

app.get('/api/persons/:id', async (request, response) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })
  })
})

app.delete('/api/persons/:id', (request, response) => {
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

app.post('/api/persons', (request, response) => {
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
    })
    .catch(error => {
      console.log(error)
      next(error)
    })

  response.json(person)
})

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`O servidor está a escoitar no porto ${PORT}`);
});