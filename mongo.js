const mongoose = require('mongoose')

let password = ''
let nameArgv = ''
let numberArgv = ''
let getAll = false

if (process.argv.length<3) {
  console.log('Please give password as argument')
  process.exit(1)
} else if (process.argv.length<4) {
  getAll = true
} else if (process.argv.length<5) {
  console.log('Please give number as argument')
  process.exit(1)
} else {
  nameArgv = process.argv[3]
  numberArgv = process.argv[4]
}

password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.qfh9g.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: nameArgv,
  number: numberArgv,
})

if (getAll) {
  console.log('Phonebook:')
  Person.find({}).then(people=> {
    people.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  person.save().then(result => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}