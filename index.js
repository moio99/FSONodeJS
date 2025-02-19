const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

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

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "0"
  },
  {
    name: "Ada Lovelace",
    number: "040-123456",
    id: "1"
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "2"
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "3"
  },
  {
    name: "Claude Monet",
    number: "40-23-6423122",
    id: "4"
  },
  {
    name: "Paul Cézanne",
    number: "50-23-6423122",
    id: "5"
  },
]

app.get('/info', (request, response) => {
  const date = new Date().toString()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date})</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.statusMessage = `No person has been found with id ${id}`
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    persons = persons.filter(person => person.id !== id)
    console.log(`Person ${id} deleted`)
    response.statusMessage = `The person with id ${id} was deleted`
    response.status(204).end()
  } else {
    response.statusMessage = `No person has been found with id ${id}`
    response.status(404).end()
  }
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
  } else if (nameAlreadyExists(body.name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  persons = persons.concat(person)

  response.json(person)
})

const generateId = () => {
  let newId = 0
  let person = ''
  while (person !== undefined) {
    newId = Math.floor(Math.random() * (10000 - 100 + 1)) + 100
    person = persons.find(person => person.id === newId.toString())
  }
  return newId.toString()
}

const nameAlreadyExists = (name) => {
  const person = persons.find(person => person.name === name)
  return person ? true : false
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`O servidor está a escoitar no porto ${PORT}`);
});