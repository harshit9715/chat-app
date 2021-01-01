const path = require('path')
const http = require('http')
const express = require('express');
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname,'../public')

app.use(express.static(publicDirPath))

let count = 0
io.on('connection', (socket)=> {

    console.log('new ws conn')
    socket.emit('countUpdated', count)

    socket.on('increment', () => {
        count++;
        // socket.emit('countUpdated', count) // emits event to specific conn
        io.emit('countUpdated', count) // emits event to every connection
    })
})



server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
    console.log(`http://localhost:${port}`)
})
