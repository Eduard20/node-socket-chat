/**
 * Created by Edo on 12/21/2015.
 */

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = {};

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
})
app.use(express.static(__dirname));
io.sockets.on('connection', function(socket){
    socket.on('new user', function(data, callback){
        if(data in users) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            users[socket.nickname] = socket;
            updateNicknames();
        }
    });

    function updateNicknames() {
        io.sockets.emit('usernames', Object.keys(users));
    }

    socket.on('send message', function(data, callback){
        var msg = data.trim();
        if (msg.substr(0,3) === '/w ') {
            msg = msg.substr(3);
            var ind = msg.indexOf(' ');
            if(ind !== -1) {
                var name = msg.substring(0, ind);
                var msg = msg.substring(ind + 1);
                if(name in users) {
                    users[name].emit('pm', {msg: msg, nick: socket.nickname});
                    console.log('PM');
                } else {
                    callback('Error! Enter a valid login');
                }
            } else {
                callback('ERROR!  Please write a message!');
            }
        } else {
            io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
        }

        //socket.broadcast.emit('new message', data);
    });
    socket.on('disconnect', function(data){
       if(!socket.nickname) return;
        delete users[socket.nickname];
        updateNicknames();
    });
});

server.listen(3000);