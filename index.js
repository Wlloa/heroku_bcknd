//const http = require('http')
const { response, request } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

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

// const app = http.createServer((request, response) => {
//     response.writeHead(200, {'Content-Type': 'application/json'})
//     response.end(JSON.stringify(notes))
// })

const PORT = process.env.PORT || 3001

app.get('/', (request, response) => {
    response.send('<h1>Hello World </h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if(note){
        response.json(note)
    }
    else {
        response.status(404).end()
    }
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

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    }

    notes = notes.concat(note)

    response.json(note)
})

app.delete('/api/notes/:id', (request, response) =>{
    const id = Number(request.param.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()    
})

app.put('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const body = req.body
  notes = notes.filter(n => n.id !== id)
  notes = notes.concat(body)
  res.status(201).json(body)
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
//app.listen(PORT)
//console.log(`Server running on port ${PORT}`)