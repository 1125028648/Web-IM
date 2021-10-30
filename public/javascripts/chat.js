// 类的构造函数
var Chat = function(socket){
    this.socket = socket;
};

Chat.prototype.sendMessage = function(room, text){
    var message = {
        room: room,
        text: text
    };
    this.socket.emit('message', message);
};

Chat.prototype.changeRoom = function(room){
    this.socket.emit('join', {newRoom: room});
};

// 处理聊天命令
Chat.prototype.processCommand = function(command){
    var words = command.split(' ');
    // 去除'/'符号
    var command = words[0].substring(1, words[0].length).toLowerCase();
    var message = false;

    switch(command) {
        case 'join':
            // 移除第一个元素
            words.shift();
            var room = words.join(' ');
            this.changeRoom(room);
            break;
        case 'nick':
            words.shift();
            var name = words.join(' ');
            this.socket.emit('nameAttempt', name);
            break;
        default:
            message = 'Unrecognized command.';
            break;
    }

    return message;
}