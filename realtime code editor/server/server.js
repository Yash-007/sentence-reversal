const express= require("express");
const app = express();
const http= require("http");
const server = http.createServer(app);

const {Server} = require("socket.io");
const cors= require("cors");

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})


app.get("/", (req,res)=>{
    res.send("Hello from the server");
});

const socketID_to_Users_Map = {};
const roomID_to_Code_Map= {};

const getUsersinRoom= async(roomId, io)=>{
   const socketList = await io.in(roomId).allSockets();
   const userslist= [];
   socketList.forEach(each=>{
    (each in socketID_to_Users_Map) && userslist.push
    (socketID_to_Users_Map[each].username)
   });

   return userslist;
}

const updateUserslistAndCodeMap= async(io, socket, roomId)=>{
  socket.in(roomId).emit("member left", {username:
    socketID_to_Users_Map[socket.id].username  });
  
  // update the user list 
  delete socketID_to_Users_Map[socket.id];

  const userslist = await getUsersinRoom(roomId, io);

  socket.in(roomId).emit("updating client list", {userslist});

  userslist.length===0 && delete roomID_to_Code_Map[roomId]

}

//Whenever someone connects this gets executed

io.on("connection", function(socket){

  socket.on("when a user joins", async({username, roomId})=>{
    console.log(username, roomId);
    socketID_to_Users_Map[socket.id]= {username};
    socket.join(roomId);

    const userslist = await getUsersinRoom(roomId, io);

    // for other users, update the client list
    socket.in(roomId).emit("updating client list", {userslist});

    // for this users, update the client list
    io.in(socket.id).emit("updating client list", {userslist});

  // send the latest code changes to this user when joined to
  //  existing room 

  if(roomId in roomID_to_Code_Map){
    io.to(socket.id).emit("on language change", {languageUsed:
    roomID_to_Code_Map[roomId].languageUsed})

    io.to(socket.id).emit("on code change", {code:
    roomID_to_Code_Map[roomId].code})
  }

  // alerting other users in room that new user joined 
  socket.in(roomId).emit("new member joined", {username});

  })
 
  //  updating the current value stored for each room 
  socket.on("update language", function({roomId, languageUsed}){
    console.log(`language: ${languageUsed}`);
   if(roomId in roomID_to_Code_Map){
    roomID_to_Code_Map[roomId]['languageUsed']= languageUsed;
   }
   else{
    roomID_to_Code_Map[roomId]= {languageUsed};
   }
  })

  // for users to get the latest changes 
  socket.on("syncing the language", function({roomId}){
    if(roomId in roomID_to_Code_Map){
      socket.in(roomId).emit("on language change", {languageUsed: 
      roomID_to_Code_Map[roomId].languageUsed})
    }
  });


    //  updating the current value stored for each room 
  socket.on("update code", function({roomId, code}){
    console.log(`code: ${code}`);
   if(roomId in roomID_to_Code_Map){
    roomID_to_Code_Map[roomId]['code']= code;
   }
   else{
    roomID_to_Code_Map[roomId]= {code};
   }
  })

  // for users to get the latest changes 
  socket.on("syncing the code", function({roomId}){
    if(roomId in roomID_to_Code_Map){
      socket.in(roomId).emit("on code change", {code: 
      roomID_to_Code_Map[roomId].code})
    }
  });

  socket.on("disconnecting", function(reason){
    socket.rooms.forEach(eachRoom =>{
      if(eachRoom in roomID_to_Code_Map){
        updateUserslistAndCodeMap(io, socket, eachRoom);
      }
    })
  })

  socket.on("disconnect", function(){
    console.log("A user disconnected");
  })





})



const PORT= process.env.PORT || 5000;

server.listen(PORT, ()=>{
    console.log("server running successfully");
});
