const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    validate: {
      validator: function(v) {
        return /^.{3,}$/.test(v)
      },
      message: props => `${props.value} must be greater than 3`
    },
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{7,8}$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    minLength: 8,
    required: true
  },
})

module.exports = mongoose.model('Person', personSchema)