const express = require('express')
const app = express()

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

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const maxId = persons.length > 0 
    ? Math.max(...persons.map(n => n.id))
    : 0

    const person = (request.body)
    response.json(person)
    person.id = maxId + 1

    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})
  
    const PORT = 3001
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })