var http = require('http');  
var url=require('url');  
var fs=require('fs');  
var io=require('socket.io')(http);  

const  users = {}  //to store users
  
var server= http.createServer(function(request,response){  
    var path = url.parse(request.url).pathname; 
    switch(path) {  
                
        case '/' :  
            fs.readFile(__dirname + path + '/chat.html', function(error,data){  
                if(error)  
                {   
                   response.writeHead(404);  
                   response.write(error);  
                   response.end();   
                } else {  
                    response.writeHead(200,{'Content-Type':'text/html'});  
                    response.write(data);  
                    response.end();  
                }  
            });  
            break;  
        default :  
            response.writeHead(404);  
            response.write("opps this doesn't exist - 404");  
            response.end();  
            break;  
    }  
      
});  

server.listen(3000, () => {
    console.log("Server is running on 3000 port");
});  

var listener = io.listen(server); 

listener.sockets.on('connection', function(socket){  
   
    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    });
      
    socket.on('send-chat-message', (message) =>{  
        //console.log(message);  
        socket.broadcast.emit('chat-message', 
            {message: message, name: users[socket.id] } ); //to send every one, excluding sender
    }); 
    
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id];
    });
}); 