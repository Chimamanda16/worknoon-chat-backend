import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      content,
      readBy: [req.user._id],
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    const populatedMessage = await message.populate(
      "sender",
      "name email role"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId,
    })
      .populate("sender", "name email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};