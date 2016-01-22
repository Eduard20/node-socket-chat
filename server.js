/**
 * Created by Edo on 12/21/2015.
 */

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var nicknames = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
})
app.use(express.static(__dirname));
io.sockets.on('connection', function(socket){
    socket.on('new user', function(data, callback){
        if(nicknames.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            nicknames.push(socket.nickname);
            io.sockets.emit('usernames', nicknames);
        }
    });
    socket.on('send message', function(data){
        io.sockets.emit('new message', data);
        //socket.broadcast.emit('new message', data);
    });
});

server.listen(3000);