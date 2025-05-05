// import createError from "../utils/createError.js";
// import Order from "../models/order.model.js";
// import Gig from "../models/gig.model.js";
// import Stripe from "stripe";
// export const intent = async (req, res, next) => {
//   const stripe = new Stripe(process.env.STRIPE);

//   const gig = await Gig.findById(req.params.id);
// // Tiến bị ngu
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: gig.price * 100,
//     currency: "usd",
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });

//   const newOrder = new Order({
//     gigId: gig._id,
//     img: gig.cover,
//     title: gig.title,
//     buyerId: req.userId,
//     sellerId: gig.userId,
//     price: gig.price,
//     payment_intent: paymentIntent.id,
//   });

//   await newOrder.save();

//   res.status(200).send({
//     clientSecret: paymentIntent.client_secret,
//   });
// };

// export const getOrders = async (req, res, next) => {
//   try {
//     const orders = await Order.find({
//       ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
//       isCompleted: true,
//     });

//     res.status(200).send(orders);
//   } catch (err) {
//     next(err);
//   }
// };
// export const confirm = async (req, res, next) => {
//   try {
//     const orders = await Order.findOneAndUpdate(
//       {
//         payment_intent: req.body.payment_intent,
//       },
//       {
//         $set: {
//           isCompleted: true,
//         },
//       }
//     );

//     res.status(200).send("Order has been confirmed.");
//   } catch (err) {
//     next(err);
//   }
// };
// // Tiến bị ngu

import createError from "../utils/createError.js";
import { models } from "../models/Sequelize-mysql.js";
import Stripe from "stripe";

export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);

  const gig = await models.Gig.findByPk(req.params.id);
  if (!gig) return next(createError(404, "Gig not found!"));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = await models.Order.create({
    gigId: gig.id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: paymentIntent.id,
  });

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await models.Order.findAll({
      where: {
        ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
        isCompleted: true,
      },
    });

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

export const confirm = async (req, res, next) => {
  try {
    const [updated] = await models.Order.update(
      { isCompleted: true },
      {
        where: {
          payment_intent: req.body.payment_intent,
        },
      }
    );

    if (!updated) return next(createError(404, "Order not found!"));

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};