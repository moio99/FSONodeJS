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
]

app.get('/info', (request, response) => {
  const date = new Date().toString()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date})</p>`)
});

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const PORT = 3001
app.listen(PORT)
console.log(`The server is running on port ${PORT}`)