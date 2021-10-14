const socket=io();
let textarea=document.querySelector("#textarea");
let messageArea=document.querySelector('.message_area'); 


var name1;
var roomid;
do{
    name1=prompt("please Enter Your name:");
    roomid=prompt("Enter a roomid:");
}while(!name1)
socket.emit('joinRoom',roomid);
textarea.addEventListener('keyup',(e)=>{
    if(e.key==='Enter'){
        //console.log(e.target.value);
        sendMessage(e.target.value);
        e.target.value='';
        
    }
});
function sendMessage(message){
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    let msg={
        user:name1,
        message:message.trim(),
        time:time,
        roomid:roomid
    }
    appendMessage(msg,'outgoing');
    scrollToBottom();
    socket.emit('message',msg);
    
}

//KeyUp Event Fire
textarea.addEventListener('keyup',(e)=>{
    socket.emit('typing',name1);
    
});


function appendMessage(msg,type){
    let mainDiv=document.createElement('div');
    let className=type;
    mainDiv.classList.add(className,'message');
    let markup=`
       <h4>${msg.user}<label>${msg.time}</label></h4>
       <p>${msg.message}</p>
     `
     mainDiv.innerHTML=markup
     messageArea.appendChild(mainDiv);
        
}

//recive message
socket.on('message',(msg)=>{
    appendMessage(msg,'incoming');
    scrollToBottom();
});
//function bounced function
let timerId=null;
function bounced(func,timer){
    if(timerId)
    {
        clearTimeout(timerId);
    }
    
    timerId=setTimeout(()=>{
        func()
    },timer);

}
//end function bounced

//append Typing Event
socket.on("typing",(data)=>{
    document.getElementById("typing").innerHTML=data+" is typing...";
    
    bounced(function(){
       document.getElementById("typing").innerHTML=''; 
    },1000)
});
//end appen Typing event
//scroll Function
function scrollToBottom(){
    messageArea.scrollTop=messageArea.scrollHeight;
}