import Conversation from "../models/Conversation.js";

export const createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;

    const existingConversation = await Conversation.findOne({
      participants: {
        $all: [req.user._id, participantId],
      },
    });

    if (existingConversation) {
      const populatedConversation = await existingConversation.populate(
        "participants",
        "name email role"
      );

      return res.json(populatedConversation);
    }

    const conversation = await Conversation.create({
      participants: [req.user._id, participantId],
    });

    const populatedConversation = await conversation.populate(
      "participants",
      "name email role"
    );

    res.status(201).json(populatedConversation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name email role")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "name",
        },
      })
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
