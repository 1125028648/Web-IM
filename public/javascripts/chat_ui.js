// 处理用户文本
function divEscapedContentElement(message){
    return $('<div></div>').text(message);
}


// 处理系统文本
function divSystemContentElement(message){
    return $('<div></div>').html('<i>' + message + '</i>');
}

// 处理原始用户输入
function processUserInput(chatApp, socket){
    var message = $('#send-message').val();
    var currentName = $('#username').text();
    var ans = $('<div></div>').html('<i style="color: blue">' + currentName + ': ' + message + '</i>')

    chatApp.sendMessage($('#room-name').text(), message);
    $('#messages').append(ans);
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    $('#send-message').val('');
}

// 客户端程序初始化逻辑
var socket = io.connect();

$(document).ready(function(){
    var chatApp = new Chat(socket);

    socket.on('nameResult', function(result){
        if(result.success){
            $('#username').text(result.name);
        }else{
            $('#messages').append(divSystemContentElement(result.message));
        }
    });

    socket.on('joinResult', function(result){
        $('#room-name').text(result.room);
        $('#messages').append(divSystemContentElement('Room changed.'));
    });

    socket.on('message', function(message){
        var newElement = $('<div></div>').text(message.text);
        $('#messages').append(newElement);
    });

    socket.on('rooms', function(rooms){
        $('#room-list').empty();

        for(var room in rooms){
            room = room.substring(1, room.length);
            if(room != ''){
                $('#room-list').append(divEscapedContentElement(room));
            }
        }

        $('#room-list div').click(function(){
            chatApp.changeRoom($(this).text());
            $('#send-message').focus();
        });
    });

    setInterval(function(){
        socket.emit('rooms');
    }, 1000);

    $('#send-message').focus();

    $('#send-form').submit(function(){
        processUserInput(chatApp, socket);
        return false;
    });

    $('#change-room-form').submit(function(){
        chatApp.changeRoom($('#change-room').val());
        return false;
    });

    $('#rename-form').submit(function(){
        chatApp.rename($('#rename').val());
        return false;
    });
});
