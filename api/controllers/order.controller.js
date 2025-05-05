import { models } from '../models/Sequelize-mysql.js';
import Stripe from 'stripe';
import createError from '../utils/createError.js';

// Tạo payment intent cho đơn hàng
export const createPaymentIntent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);

  try {
    const gig = await models.Gig.findByPk(req.params.id);
    if (!gig) {
      return next(createError(404, 'Gig not found!'));
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100,
      currency: 'usd',
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

    console.log(`Payment intent created: orderId=${newOrder.id}`);
    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error.message);
    return next(error);
  }
};

// Lấy danh sách đơn hàng
export const getOrders = async (req, res, next) => {
  try {
    const orders = await models.Order.findAll({
      where: {
        ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
        isCompleted: true,
      },
    });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    return next(error);
  }
};

// Xác nhận đơn hàng
export const confirmOrder = async (req, res, next) => {
  try {
    const [updated] = await models.Order.update(
      { isCompleted: true },
      {
        where: {
          payment_intent: req.body.payment_intent,
        },
      }
    );

    if (!updated) {
      return next(createError(404, 'Order not found!'));
    }

    console.log(`Order confirmed: payment_intent=${req.body.payment_intent}`);
    return res.status(200).json({ success: true, message: 'Order has been confirmed' });
  } catch (error) {
    console.error('Error confirming order:', error.message);
    return next(error);
  }
};