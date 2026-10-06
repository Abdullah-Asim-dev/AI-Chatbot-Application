const Conversation = require("../models/Conversation");
const User = require("../models/User");
const {
  generateGeminiResponse,
} = require("../services/gemini.service");

const FREE_MESSAGE_LIMIT = 15;

const chat = async (req, res) => {
  try {
    const { conversationId, messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Messages are required",
      });
    }

    const validMessages = messages.filter(
      (msg) =>
        msg &&
        ["user", "assistant"].includes(msg.role) &&
        typeof msg.content === "string" &&
        msg.content.trim()
    );

    if (validMessages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid messages are required",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /*
     * PRO SUBSCRIPTION EXPIRY CHECK
     *
     * If the user's Pro subscription has expired,
     * automatically move the account back to Free.
     */
    if (
      user.plan === "pro" &&
      user.subscriptionEnd &&
      new Date() >= new Date(user.subscriptionEnd)
    ) {
      user.plan = "free";
      user.subscriptionStatus = "expired";

      await user.save();
    }

    /*
     * FREE PLAN LIMIT
     *
     * Free users get 15 lifetime AI messages.
     * Pro users can continue chatting while
     * their subscription is active.
     */
    if (
      user.plan === "free" &&
      user.messageCount >= FREE_MESSAGE_LIMIT
    ) {
      return res.status(403).json({
        success: false,
        code: "FREE_LIMIT_REACHED",
        message:
          "You have reached your 15 free messages. Upgrade to Nexora Pro to continue chatting.",
        limit: FREE_MESSAGE_LIMIT,
        used: user.messageCount,
        plan: user.plan,
      });
    }

    let conversation;

    /*
     * Existing conversation
     */
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        user: req.user.userId,
      });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }
    } else {
      /*
       * New conversation
       */
      conversation = await Conversation.create({
        user: req.user.userId,
        title: validMessages[0].content.slice(0, 50),
        messages: [],
      });
    }

    /*
     * Get latest user message
     */
    const latestUserMessage =
      validMessages[validMessages.length - 1];

    conversation.messages.push({
      role: "user",
      content: latestUserMessage.content,
    });

    /*
     * Generate AI response
     */
    const aiResponse = await generateGeminiResponse(
      conversation.messages
    );

    /*
     * Save AI response
     */
    conversation.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    await conversation.save();

    /*
     * Count only successful AI responses
     *
     * Pro users are NOT counted.
     */
    if (user.plan === "free") {
      user.messageCount += 1;

      await user.save();
    }

    /*
     * Remaining messages
     */
    const remainingMessages =
      user.plan === "free"
        ? Math.max(
            FREE_MESSAGE_LIMIT - user.messageCount,
            0
          )
        : null;

    return res.status(200).json({
      success: true,
      conversationId: conversation._id,
      message: aiResponse,

      usage: {
        plan: user.plan,

        used: user.messageCount,

        limit:
          user.plan === "free"
            ? FREE_MESSAGE_LIMIT
            : null,

        remaining: remainingMessages,

        subscriptionStatus:
          user.subscriptionStatus || null,

        subscriptionEnd:
          user.plan === "pro"
            ? user.subscriptionEnd
            : null,
      },
    });
  } catch (error) {
    console.error("Chat Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while generating the response",
      error: error.message,
    });
  }
};

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      user: req.user.userId,
    })
      .sort({ updatedAt: -1 })
      .select("_id title createdAt updatedAt");

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error(
      "Get Conversations Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching conversations",
      error: error.message,
    });
  }
};

const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user.userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error(
      "Get Conversation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching conversation",
      error: error.message,
    });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation =
      await Conversation.findOneAndDelete({
        _id: conversationId,
        user: req.user.userId,
      });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Conversation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while deleting conversation",
      error: error.message,
    });
  }
};

module.exports = {
  chat,
  getConversations,
  getConversation,
  deleteConversation,
};