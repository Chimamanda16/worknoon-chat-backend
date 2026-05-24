const onlineUsers = new Map();

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // USER ONLINE
    socket.on("setup", (userId) => {
      onlineUsers.set(userId, socket.id);

      socket.join(userId);

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      console.log("Online users:", onlineUsers);
    });

    // JOIN CONVERSATION ROOM
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);

      console.log(`Joined room: ${conversationId}`);
    });

    // SEND MESSAGE
    socket.on("sendMessage", (message) => {
      io.to(message.conversation).emit("newMessage", message);
    });

    // TYPING
    socket.on("typing", (conversationId) => {
      socket.to(conversationId).emit("typing");
    });

    // STOP TYPING
    socket.on("stopTyping", (conversationId) => {
      socket.to(conversationId).emit("stopTyping");
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      console.log("User disconnected");
    });
  });
};

export default chatSocket;