const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const io = require('socket.io')(8900,{
       cors:{
              origin :"http://localhost:3000"
       },
});
const morgan = require("morgan");
const helmet = require("helmet");
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const chatRoute = require("./routes/conversation")
const messageRoute = require("./routes/messages");
const cors = require("cors")




dotenv.config();


mongoose 
 .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,   })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));
//middleware

app.use(express.json());
app.use(helmet())
app.use(morgan("common"))
app.use(cors())


app.use("/api/user",userRoute)
app.use("/api/chat",chatRoute)
app.use("/api/auth",authRoute)
app.use("/api/message",messageRoute)


const http = require('http');


const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

let users = [];

const addUser = (userId,socketId)=>{
       !users.some((user)=>user.userId==userId) && users.push({userId,socketId})
}

const removeUser = (socketId)=>{
   users=users.filter(user=>user.socketId !==socketId)
}

const getUser = (Id)=>{
       return users.find(user=>user.userId === Id)
}

io.on("connection",(socket)=>{
       //connect
       console.log("user connected")
       socket.on("User",(userId)=>{
      addUser(userId,socket.id)
      io.emit("users",users)
    })
    
    //send messages
      socket.on("send",({sender,recevierId,text})=>{
       
       const user = getUser(recevierId);
       if(user)
       {
       io.to(user.socketId).emit("getmessage",{
              sender,text,
       })
       }
       
      })

      
    

    //disconnect
    socket.on("disconnect",()=>{
       removeUser(socket.id)
       io.emit("users",users)
    })
})

const host = '0.0.0.0';


app.use("/",router);

router.get("/",(req,res)=>{
       res.status(200).send("hello and welcome to my server")
})
server.listen(PORT,host,()=>{console.log(`we listening at ${PORT}`)});

