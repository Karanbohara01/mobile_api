// import express from "express";
// import http from "http";
// import { Server } from "socket.io";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: process.env.URL,
//     methods: ["GET", "POST"],
//   },
// });

// const userSocketMap = {}; // this map stores socket id corresponding to the user id; userId -> socketId

// export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId;
//   if (userId) {
//     userSocketMap[userId] = socket.id;
//     console.log(`🟢 User Connected: ${userId} - Socket ID: ${socket.id}`);
//   }

//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   // ✅ Handle new message events
//   socket.on("newMessage", ({ senderId, receiverId, message }) => {
//     console.log(`📩 New Message from ${senderId} to ${receiverId}: ${message}`);

//     const receiverSocketId = getReceiverSocketId(receiverId);
//     const senderSocketId = getReceiverSocketId(senderId);

//     // ✅ Send message to receiver
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", { senderId, message });
//     }

//     // ✅ Notify sender that message was sent
//     if (senderSocketId) {
//       io.to(senderSocketId).emit("messageSentConfirmation", { message });
//     }
//   });

//   // ✅ Handle typing indicator
//   socket.on("typing", ({ senderId, receiverId }) => {
//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("typing", { senderId });
//     }
//   });

//   // ✅ Handle disconnection
//   socket.on("disconnect", () => {
//     if (userId) {
//       delete userSocketMap[userId];
//       console.log(`🔴 User Disconnected: ${userId}`);
//       io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     }
//   });
// });

// export { app, io, server };

import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.URL,
    methods: ["GET", "POST"],
  },
});

// ✅ Store user socket mappings (userId -> socketId)
const userSocketMap = {};

// ✅ Function to get receiver's socket ID
const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`🟢 User Connected: ${userId} - Socket ID: ${socket.id}`);
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Broadcast online users
  }

  // ✅ Handle real-time messaging
  socket.on("newMessage", ({ senderId, receiverId, message }) => {
    console.log(`📩 New Message from ${senderId} to ${receiverId}: ${message}`);

    const receiverSocketId = getReceiverSocketId(receiverId);
    const senderSocketId = getReceiverSocketId(senderId);

    // ✅ Emit message to receiver
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", { senderId, message });
    }

    // ✅ Confirm message sent to sender
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageSentConfirmation", { message });
    }
  });

  // ✅ Handle typing indicator
  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId });
    }
  });

  // ✅ Handle user disconnect
  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      console.log(`🔴 User Disconnected: ${userId}`);
      io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update online users list
    }
  });

  // ✅ Handle force disconnect (e.g., user logout)
  socket.on("forceDisconnect", () => {
    if (userId && userSocketMap[userId]) {
      socket.disconnect();
      delete userSocketMap[userId];
      console.log(`🔴 User Logged Out: ${userId}`);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, getReceiverSocketId, io, server };
