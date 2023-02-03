const express = require('express')
const app = express()

app.use(express.json())

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
    person.id = maxId + 1
    console.log('%cindex.js line:57 person.name', 'color: #007acc;', person.name);
    if (person.hasOwnProperty("name") && person.hasOwnProperty("number")) {

        if (persons.map(contact => contact.name === person.name)) {
            response.json({error: "Names must be unique"})
            response.status(200).end()
        } else {
            persons = persons.concat(person)
            response.json(person)
            console.log("added new person")
        }        
    } else {
        response.json({error: 'the name or number is missing'})
        response.status(200).end()
    }
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