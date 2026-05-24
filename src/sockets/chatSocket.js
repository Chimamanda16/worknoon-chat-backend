const onlineUsers = new Map();

const getId = (value) => value?._id?.toString?.() || value?.toString?.();

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

    socket.on("leaveConversation", (conversationId) => {
      socket.leave(conversationId);

      console.log(`Left room: ${conversationId}`);
    });

    // SEND MESSAGE
    socket.on("sendMessage", (message) => {
      const conversation = message.conversation;
      const conversationId = getId(conversation);
      const senderId = getId(message.sender);

      if (!conversationId || !conversation?.participants) return;

      conversation.participants.forEach((participant) => {
        const participantId = getId(participant);

        if (!participantId || participantId === senderId) return;

        socket.to(participantId).emit("conversationUpdated", {
          conversation,
          message,
        });
      });

      socket.to(conversationId).emit("newMessage", message);
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
