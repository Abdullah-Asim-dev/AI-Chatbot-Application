const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateGeminiResponse = async (messages) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash-lite",
  });

  const chat = model.startChat({
    history: messages.slice(0, -1).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    })),
  });

  const latestMessage = messages[messages.length - 1].content;

  const result = await chat.sendMessage(latestMessage);

  return result.response.text();
};

module.exports = {
  generateGeminiResponse,
};