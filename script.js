/**
 * Created by Edo on 1/21/2016.
 */

jQuery(function($){
    var socket = io.connect();
    var $chat = $("#chat");
    var $messageBox = $('#messageBox');
    var $message = $('#message');

    $messageBox.submit(function(e){
        e.preventDefault();
        socket.emit('send message', $message.val());
        $message.val("");
    });
    socket.on('new message', function(data){
        $chat.append(data + "<br>");
    });
});