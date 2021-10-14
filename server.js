const { Socket } = require("dgram");
const express=require("express");
const app=express();
const http=require('http').createServer(app);
const path=require('path');
const io = require('socket.io')(http);
const PORT= process.env.PORT || 5000
http.listen(PORT,()=>{
    console.log("Listening on port 5000");
});
app.use(express.static('public'));  
/*app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/index.html');
});*/
//socket
io.on("connection",(socket)=>{
    console.log("connected..");
    socket.on('joinRoom',room=>{
        console.log(room)
        socket.join(room);
    })
    socket.on('message',(msg)=>{
        socket.broadcast.to(msg.roomid).emit('message',msg);
    })
    socket.on('typing',(data)=>
    {
        socket.broadcast.emit('typing',data);
    });
})