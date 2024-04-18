const express = require('express');
require('dotenv').config();
require('./dbConfig')
const app = express();
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const server = http.createServer(app);
const io = new Server(server);

const { sendMessage } = require('./controllers/socketFuctionController')

const mainRouter = require('./routes/main.routes')
// Socket.io

io.on('connection', (socket) => {
    console.log('socket connection established')
    socket.on('message', (data) => {
        sendMessage(data, socket)
    })
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', mainRouter)


app.get('/get', (req, res) => {
    res.send('hello')
})

server.listen(process.env.PORT, () => {
    console.log(`server running on port: ${process.env.PORT}`);
    console.log('socket connection established')
}
)