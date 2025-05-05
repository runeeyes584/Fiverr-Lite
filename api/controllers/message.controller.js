// import createError from "../utils/createError.js";
// import Message from "../models/message.model.js";
// import Conversation from "../models/conversation.model.js";

// export const createMessage = async (req, res, next) => {
//   const newMessage = new Message({
//     conversationId: req.body.conversationId,
//     userId: req.userId,
//     desc: req.body.desc,
//   });
//   try {
//     const savedMessage = await newMessage.save();
//     await Conversation.findOneAndUpdate(
//       { id: req.body.conversationId },
//       {
//         $set: {
//           readBySeller: req.isSeller,
//           readByBuyer: !req.isSeller,
//           lastMessage: req.body.desc,
//         },
//       },
//       { new: true }
//     );

//     res.status(201).send(savedMessage);
//   } catch (err) {
//     next(err);
//   }
// };
// export const getMessages = async (req, res, next) => {
//   try {
//     const messages = await Message.find({ conversationId: req.params.id });
//     res.status(200).send(messages);
//   } catch (err) {
//     next(err);
//   }
// };
// // Tiến bị ngu

import createError from "../utils/createError.js";
import { models } from "../models/Sequelize-mysql.js";

export const createMessage = async (req, res, next) => {
  try {
    const conversation = await models.Conversation.findByPk(req.body.conversationId);
    if (!conversation)
      return next(createError(404, "Conversation not found!"));

    const newMessage = await models.Message.create({
      conversationId: req.body.conversationId,
      userId: req.userId,
      desc: req.body.desc,
    });

    await models.Conversation.update(
      {
        readBySeller: req.isSeller,
        readByBuyer: !req.isSeller,
        lastMessage: req.body.desc,
      },
      {
        where: { id: req.body.conversationId },
      }
    );

    res.status(201).send(newMessage);
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await models.Message.findAll({
      where: { conversationId: req.params.id },
    });
    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};