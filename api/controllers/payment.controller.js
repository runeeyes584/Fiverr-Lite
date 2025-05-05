import { models } from '../models/Sequelize-mysql.js';

// Tạo thanh toán
export const createPayment = async (req, res, next) => {
  try {
    const { order_id, buyer_clerk_id, amount, payment_method, payment_status, transaction_id } = req.body;
    if (!order_id || !buyer_clerk_id || !amount) {
      return res.status(400).json({ success: false, message: 'Missing required fields: order_id, buyer_clerk_id, or amount' });
    }
    const payment = await models.Payment.create({
      order_id,
      buyer_clerk_id,
      amount,
      payment_method,
      payment_status,
      transaction_id,
    });
    console.log(`Payment created: id=${payment.id}`);
    return res.status(201).json({ success: true, message: 'Payment created successfully', payment });
  } catch (error) {
    console.error('Error creating payment:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating payment', error: error.message });
  }
};

// Lấy tất cả thanh toán (phân trang)
export const getAllPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, order_id, buyer_clerk_id } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (order_id) where.order_id = order_id;
    if (buyer_clerk_id) where.buyer_clerk_id = buyer_clerk_id;

    const payments = await models.Payment.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    return res.status(200).json({
      success: true,
      total: payments.count,
      pages: Math.ceil(payments.count / limit),
      payments: payments.rows,
    });
  } catch (error) {
    console.error('Error fetching payments:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching payments', error: error.message });
  }
};

// Lấy thanh toán theo ID
export const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await models.Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    return res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error('Error fetching payment:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching payment', error: error.message });
  }
};

// Cập nhật thanh toán
export const updatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { payment_status, transaction_id } = req.body;
    const payment = await models.Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    await payment.update({ payment_status, transaction_id });
    console.log(`Payment updated: id=${id}`);
    return res.status(200).json({ success: true, message: 'Payment updated successfully', payment });
  } catch (error) {
    console.error('Error updating payment:', error.message);
    return res.status(500).json({ success: false, message: 'Error updating payment', error: error.message });
  }
};

// Xóa thanh toán
export const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await models.Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    await payment.destroy();
    console.log(`Payment deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting payment', error: error.message });
  }
};