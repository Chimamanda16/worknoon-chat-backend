import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    conversationKey: {
      type: String,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index(
  { conversationKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      conversationKey: { $type: "string" },
    },
  }
);

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);

export default Conversation;
