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

app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const PORT = 3001
app.listen(PORT)
console.log(`The server is running on port ${PORT}`)