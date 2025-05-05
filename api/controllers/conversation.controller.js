// import createError from "../utils/createError.js";
// import Conversation from "../models/conversation.model.js";

// export const createConversation = async (req, res, next) => {
//   const newConversation = new Conversation({
//     id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId,
//     sellerId: req.isSeller ? req.userId : req.body.to,
//     buyerId: req.isSeller ? req.body.to : req.userId,
//     readBySeller: req.isSeller,
//     readByBuyer: !req.isSeller,
//   });
// // Tiến bị ngu
//   try {
//     const savedConversation = await newConversation.save();
//     res.status(201).send(savedConversation);
//   } catch (err) {
//     next(err);
//   }
// };

// export const updateConversation = async (req, res, next) => {
//   try {
//     const updatedConversation = await Conversation.findOneAndUpdate(
//       { id: req.params.id },
//       {
//         $set: {
//           // readBySeller: true,
//           // readByBuyer: true,
//           ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
//         },
//       },
//       { new: true }
//     );

//     res.status(200).send(updatedConversation);
//   } catch (err) {
//     next(err);
//   }
// };

// export const getSingleConversation = async (req, res, next) => {
//   try {
//     const conversation = await Conversation.findOne({ id: req.params.id });
//     if (!conversation) return next(createError(404, "Not found!"));
//     res.status(200).send(conversation);
//   } catch (err) {
//     next(err);
//   }
// };

// export const getConversations = async (req, res, next) => {
//   try {
//     const conversations = await Conversation.find(
//       req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }
//     ).sort({ updatedAt: -1 });
//     res.status(200).send(conversations);
//   } catch (err) {
//     next(err);
//   }
// };

import createError from "../utils/createError.js";
import { models } from "../models/Sequelize-mysql.js";

export const createConversation = async (req, res, next) => {
  try {
    const existingConversation = await models.Conversation.findOne({
      where: {
        [req.isSeller ? "sellerId" : "buyerId"]: req.userId,
        [req.isSeller ? "buyerId" : "sellerId"]: req.body.to,
      },
    });

    if (existingConversation)
      return next(createError(400, "Conversation already exists!"));

    const newConversation = await models.Conversation.create({
      sellerId: req.isSeller ? req.userId : req.body.to,
      buyerId: req.isSeller ? req.body.to : req.userId,
      readBySeller: req.isSeller,
      readByBuyer: !req.isSeller,
    });

    res.status(201).send(newConversation);
  } catch (err) {
    next(err);
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    const [updated] = await models.Conversation.update(
      {
        ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
      },
      {
        where: { id: req.params.id },
      }
    );

    if (!updated) return next(createError(404, "Conversation not found!"));

    const updatedConversation = await models.Conversation.findByPk(req.params.id);
    res.status(200).send(updatedConversation);
  } catch (err) {
    next(err);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await models.Conversation.findByPk(req.params.id);
    if (!conversation) return next(createError(404, "Conversation not found!"));
    res.status(200).send(conversation);
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await models.Conversation.findAll({
      where: req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).send(conversations);
  } catch (err) {
    next(err);
  }
};