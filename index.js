//const http = require('http')
const { response, request } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

require('dotenv').config()

const Note = require('./models/note')

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2019-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2019-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: true
    }
  ]


const PORT = process.env.PORT || 3001

app.get('/', (request, response) => {
    response.send('<h1>Hello World </h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id).then( note => {
        if (note) {
            response.json(note)
        }
        else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(404).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })

    response.json(note)
})

app.delete('/api/notes/:id', (request, response) =>{
    Note.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
})

app.put('/api/notes/:id', (req, res, next) => {
    const body = req.body

    const note = {
        content: body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(req.params.id, note, {new:true})
    .then( updatedNote => {
        res.json(updatedNote)
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
    console.log(error)

    if (error.name === 'CastError') {
        response.status(400).send({error: "malformed id"})
    }

    next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
