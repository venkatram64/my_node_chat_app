const http = require('http');  
const url = require('url'); 
const io = require('socket.io')(http); 

const chatRouter = require('./chatRouter');

const  users = {}  //to store users
  
const server= http.createServer(chatRouter.handler);  //node http server
//starting node server
server.listen(3000, () => {
    console.log("Server is running on 3000 port");
});  

//related to the socket io functionality
const listener = io.listen(server); 

listener.sockets.on('connection', function(socket){  
   //receiving message from client
    socket.on('new-user', name => {
        users[socket.id] = name; //assigning a user with unique socket id
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