const { Socket } = require('socket.io')

const io=require('socket.io')(8800,{
    cors:{
        origin:"*"
    }
})

let activeUsers=[]

io.on('connection',(socket)=>{
    // add new User
    socket.on('new-user-add',(newUserId)=>{
        console.log(newUserId,'new');
        if(!activeUsers.some((user)=>user?.userId==newUserId)){
            
            activeUsers.push({
                userId:newUserId,
                socketId:socket.id
            })
            
        }
        console.log("connected users",activeUsers);
        io.emit('get-users',activeUsers)
    })
    //send message
    socket.on("send-message",(data)=>{
        console.log(data,'dataofsocket');
        const {receiverId}=data
    
        const user=activeUsers.find((user)=> user.userId==receiverId)
        console.log("sending from socket to :",receiverId);
        console.log("Data",data);
        if(user){
            io.to(user.socketId).emit("receive-message",data)
        }

    })
    socket.on("disconnect",()=>{
        activeUsers=activeUsers.filter((user)=> user.socketId!==socket.id)
        console.log("user disconnected",activeUsers)
        io.emit('get-users',activeUsers)
        
    })


})