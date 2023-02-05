const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)


app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan(function (tokens, req, res) {
        let pituus = tokens.res(req, res, 'content-length')
        if (pituus === undefined) {
            pituus = "-"
        }
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            pituus, '-',
            tokens['response-time'](req, res), 'ms',
            JSON.stringify(req.body)
            ].join(' ')
    
}))


let persons = [
        {
        "name": "Arto Hellas",
        "number": "wow",
        "id": 1
        },
        {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
        },
        {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
        }
    ]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/info', (request, response) => {
    let line1 = "<div>Phonebook has info for " + persons.length + " people</div>"
    let today = new Date()
    let line2 = "\n <div> " + today + " </div>"
    console.log(Date.now())
    response.send(line1+line2)
})

app.get('/api/persons', (request, response, next) => {
    Person.find({})
    .then(people => {
        response.json(people)
    })
    .catch(error => next(error))
  })

app.use(morgan('tiny'))

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.use(morgan('tiny'))

app.post('/api/persons', (request, response, next) => {
    const data = (request.body)
    const person = new Person({
        name: data.name,
        number: data.number
    })

    if (data.name === undefined || data.number === undefined) {
        return response.status(400).json({error: 'the name or number is missing'})
    }

    persons = persons.concat(data)
    person.save()
    .then(result => {
        response.json(result)
    })
    .catch(error => next(error))
})

app.use(morgan('tiny'))

app.put('/api/persons/:id', (request, response, next) => {
    const requestdata = request.body
    const person = {
        name: requestdata.name,
        number: requestdata.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(morgan('tiny'))

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error  => next(error))
})

app.use(morgan('tiny'))
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})