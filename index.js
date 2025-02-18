const express = require('express')
const app = express()

app.use(express.json())

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
});

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

const generateId = () => {
  let newId = 0;
  let person = ''
  while (person !== undefined) {
    newId = Math.floor(Math.random() * (10000 - 100 + 1)) + 100;
    person = persons.find(person => person.id === newId.toString())
  }
  return newId.toString()
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body) {
    return response.status(400).json({ 
      error: 'No body send' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`The server is running on port ${PORT}`)