import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: ["https://haccnitrr.netlify.app"]
    },
});

export function getOnlineUserCount(){
    return onlineUserCount;
}

let onlineUserCount = 0;

io.on("connection", (socket) => {
  console.log("a user connected", socket.id); 

  const userId = socket.handshake.query.id;
  
  // Validate the user ID
  if (!userId || typeof userId !== 'string') {
    console.log("Invalid connection attempt - missing or invalid user ID:", userId);
    socket.disconnect();
    return;
  }
  
  console.log("User connected:", userId);

  onlineUserCount++;  

  io.emit("getOnlineUserCount", onlineUserCount);
  
  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
    onlineUserCount--;
    io.emit("getOnlineUserCount", onlineUserCount);
  });
});

export { io, app, server};