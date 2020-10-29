const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/person')
const cors = require('cors')
const morgan = require('morgan')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('pdata', (req) => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :pdata')
)

let persons = []

/*
const generateId = () => {
  let found = true
  let id = 0
  while (found) {
    id = Math.floor(Math.random() * 100000)
    found = persons.find(p => p.id === id)
  }

  return id
}
*/

// Info page
app.get('/info', (request, response) => {
  let numPeople = 0
  Person.find({}).then(p => {
    numPeople = p.length
  })
  response.send(`
    <p>Phonebook has info for ${numPeople} people</p>
    <p>${new Date()}</p>
  `)
})

// Fetch all numbers
app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    persons = people.map(p => p.toJSON())
    response.json(persons)
  })
})

// Fetch number by id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(p => {
      if (p) {
        response.json(p)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => {
      next(err)
    })
})

// Delete number by id
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      persons = persons.filter(p => p.id !== request.params.id)
      response.status(204).end()
    })
    .catch(err => next(err))
})

// Add number to phonebook
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({
      error: 'name already in phonebook'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON())
      persons = persons.concat(savedPerson.toJSON())
    })
    .catch(err => next(err))
})

// Update number by id
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  const opts = { new: true, runValidators: true, context: 'query' }
  Person.findByIdAndUpdate(request.params.id, person, opts)
    .then(updatedPerson => {
      const pJSON = updatedPerson.toJSON()
      persons = persons.map(p => p.id !== pJSON.id ? p : pJSON)
      response.json(pJSON)
    })
    .catch(err => next(err))
})

// Error handling
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unkown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

// Start
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})