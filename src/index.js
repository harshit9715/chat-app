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

io.on('connection', (socket)=> {

    console.log('new ws conn')
    socket.emit('message', 'welcome')
})



server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
    console.log(`http://localhost:${port}`)
})
