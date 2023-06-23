const MessageModel = require("../Models/MessageModel");

async function addMessage(req, res) {
  const { chatId, senderId, text } = req.body;

  const message = new MessageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function getMessages(req, res) {
  const { chatId } = req.params;

  try {
    const result = await MessageModel.find({ chatId: chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

module.exports = {
  addMessage,
  getMessages,
};
