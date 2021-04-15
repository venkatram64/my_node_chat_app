const fs = require("fs");
const url = require("url");

function renderChatPage(path, res){
    fs.readFile(path, null, (err, data) => {
        if(err){
            res.writeHead(404);            
            res.write('File not found!');
        }else{
            res.writeHead(200,{'Content-Type':'text/html'}); 
            res.write(data);
        }
        res.end();
    });
}


const myCharRouter = function(request,response){  
    var path = url.parse(request.url).pathname; 
    const method = request.method;
    switch(path) {                 
        case '/' :             
            renderChatPage(__dirname + path + '/chat.html', response); 
            break; 
        default :  
            response.writeHead(404);  
            response.write("page not found - 404");  
            response.end();  
            break;  
    }        
}

module.exports = {
    handler: myCharRouter
}