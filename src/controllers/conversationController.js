import Conversation from "../models/Conversation.js";
import mongoose from "mongoose";

const getConversationKey = (userId, participantId) =>
  [userId.toString(), participantId.toString()].sort().join(":");

export const createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(participantId)) {
      return res.status(400).json({
        message: "Invalid participant",
      });
    }

    if (req.user._id.toString() === participantId.toString()) {
      return res.status(400).json({
        message: "You cannot create a conversation with yourself",
      });
    }

    const conversationKey = getConversationKey(req.user._id, participantId);

    const existingConversation = await Conversation.findOne({
      $or: [
        { conversationKey },
        {
          participants: {
            $all: [req.user._id, participantId],
            $size: 2,
          },
        },
      ],
    }).sort({ updatedAt: -1 });

    if (existingConversation) {
      if (!existingConversation.conversationKey) {
        const keyedConversation = await Conversation.findOne({
          conversationKey,
        });

        if (keyedConversation) {
          const populatedConversation = await keyedConversation.populate(
            "participants",
            "name email role"
          );

          return res.json(populatedConversation);
        }

        try {
          existingConversation.conversationKey = conversationKey;
          await existingConversation.save();
        } catch (error) {
          if (error.code !== 11000) {
            throw error;
          }

          const populatedConversation = await Conversation.findOne({
            conversationKey,
          }).populate("participants", "name email role");

          return res.json(populatedConversation);
        }
      }

      const populatedConversation = await existingConversation.populate(
        "participants",
        "name email role"
      );

      return res.json(populatedConversation);
    }

    let conversation;

    try {
      conversation = await Conversation.create({
        conversationKey,
        participants: [req.user._id, participantId],
      });
    } catch (error) {
      if (error.code !== 11000) {
        throw error;
      }

      conversation = await Conversation.findOne({ conversationKey });
    }

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
