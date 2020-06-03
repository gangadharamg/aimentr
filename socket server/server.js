var config = require('./config/config'),
    express = require('./config/express');
mongoose = require('./config/mongoose');
var http = require('http');

var db = mongoose();
var app = express();
// config.port
// app.listen(process.env.PORT || config.port);

var server = http.createServer(app);
const io = require('socket.io')(server);

server.listen(process.env.PORT || config.port);

io.on('connection', client => {
    client.on('connect', () => {
      io.emit('newUser', "connected");
      console.log('socket backend connected')
    })
  
    client.on('disconnect', () => {
      io.emit('userLeft', "disconnected");
      console.log('socket backend disconnected')
    })
  
    client.on('message', (m) => {
      // console.log('[server](message): %s', JSON.stringify(m));
      io.emit('message', m);
    })
  
  
    client.on("NewClient", function () {
      io.emit('CreatePeer');
    });
    client.on('Offer', (offer) => io.emit('BackOffer', offer));
    client.on('Answer', (data) => io.emit('BackAnswer', data));
    client.on('disconnect', () => io.emit('Disconnect'));
    client.on('subtitleChanged', (data) => io.emit('subtitleChanged', data));
  
    client.on('Drawing', (draw) => io.emit('Drawing', draw));
  })
  
  


module.exports = app;

console.log("your port number:" + config.port);