/**
 * Created by Edo on 1/21/2016.
 */

jQuery(function($){
    var socket = io.connect();
    var $chat = $("#chat");
    var $setNick = $("#setNick");
    var $users = $("#users");
    var $nickError = $("#nickError");
    var $nickname = $("#nickname");
    var $messageBox = $('#messageBox');
    var $message = $('#message');


    $setNick.submit(function(e){
        e.preventDefault();
        socket.emit('new user', $nickname.val(), function(data){
            if(data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html('try again baby');
            }
        });
        $nickname.val("");
    });

    socket.on('usernames', function(data) {
       var html = '';
        for(i=0; i < data.length; i++) {
            html += data[i] + '<br/>'
        }
        $users.html(html);
    });

    $messageBox.submit(function(e){
        e.preventDefault();
        socket.emit('send message', $message.val());
        $message.val("");
    });
    socket.on('new message', function(data){
        $chat.append('<b>' + data.nick +  ': </b>' + data.msg + '<br>');
    });
});