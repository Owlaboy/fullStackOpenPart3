const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fspart3:${password}@cluster0.ef4hjla.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  let nam = process.argv[3]
  let numbe = process.argv[4]
  const person = new Person({
    name: nam,
    number: numbe,
  })
  person.save().then(result => {
    console.log('Person saved')
    mongoose.connection.close()
  })
}