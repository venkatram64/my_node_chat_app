const http = require('http');  
const url=require('url');  
const fs=require('fs');  
const io=require('socket.io')(http);  

const  users = {}  //to store users
  
const server= http.createServer(function(request,response){  
    var path = url.parse(request.url).pathname; 
    switch(path) {                 
        case '/' :  
            fs.readFile(__dirname + path + '/chat.html', function(error,data){  
                if(error) {   
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
            response.write("page not found - 404");  
            response.end();  
            break;  
    }  
      
});  

server.listen(3000, () => {
    console.log("Server is running on 3000 port");
});  

const listener = io.listen(server); 

listener.sockets.on('connection', function(socket){  
   //receiving message from client
    socket.on('new-user', name => {
        users[socket.id] = name; //assigning a user with unique id
        //sending message to all the clients
        socket.broadcast.emit('user-connected', name);
    });
    //receiving message from the client  
    socket.on('send-chat-message', (message) =>{  
        //sending message to all the clients
        socket.broadcast.emit('chat-message', 
            {message: message, name: users[socket.id] } ); //to send every one, excluding sender
    }); 
    
    socket.on('disconnect', () => {
        //sending message to all the clients
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id];
    });
}); 