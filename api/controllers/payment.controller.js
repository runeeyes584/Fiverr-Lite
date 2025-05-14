import { ProductCode, VNPay, VnpLocale, dateFormat, ignoreLogger } from 'vnpay';
import { models } from '../models/Sequelize-mysql.js';

const vnpay = new VNPay({
  tmnCode: 'JEOP71C7',
  secureSecret: 'F48MKHH4U2ZRMTE5AZ47XHEO1UKRXHE5',
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  hashAlgorithm: 'SHA512',
  loggerFn: ignoreLogger
});

export const createVNPayUrl = async (req, res) => {
  try {
    const { orderId, orderDescription, amount } = req.body || {};

    const now = new Date();
    const expire = new Date(now.getTime() + 15 * 60 * 1000);

    const vnpayResponse = await vnpay.buildPaymentUrl({
      vnp_Amount: amount || 100000,
      vnp_IpAddr: req.ip || '127.0.0.1',
      vnp_TxnRef: orderId || `ORDER_${Date.now()}`,
      vnp_OrderInfo: orderDescription || 'Thanh toán đơn hàng mặc định',
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: 'http://localhost:8800/api/payments/check-payment-vnpay',
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(now),
      vnp_ExpireDate: dateFormat(expire)
    });
    if (!vnpayResponse || typeof vnpayResponse !== 'string') {
      return res.status(500).send('❌ VNPay không trả về URL');
    }

    return res.status(201).json(vnpayResponse);
  } catch (error) {
    console.error('❌ Lỗi tạo QR:', error);
    return res.status(500).send('Không tạo được QR thanh toán');
  }
};

export const handleVNPayReturn = async (req, res) => {
  try {
    const result = await vnpay.verifyReturnUrl(req.query);
    console.log("✅ Kết quả verifyReturnUrl:", result);
    // Xử lý order_id
    const orderId = Number(req.query.vnp_TxnRef);
    if (isNaN(orderId)) {
      console.error("❌ vnp_TxnRef không hợp lệ:", req.query.vnp_TxnRef);
      return res.status(400).send("Order ID không hợp lệ");
    }
    // Truy vấn đơn hàng
    const order = await models.Order.findByPk(orderId);
    if (!order) {
      return res.status(404).send("Không tìm thấy đơn hàng");
    }
    // Xác định trạng thái thanh toán
    let payment_status;
    if (result.isSuccess && req.query.vnp_ResponseCode === "00") {
      payment_status = "completed";
    } else if (!result.isVerified || req.query.vnp_ResponseCode !== "00") {
      payment_status = "failed";
    } else {
      payment_status = "pending";
    }
    // Lưu thanh toán
    await models.Payment.create({
      order_id: orderId,
      buyer_clerk_id: order.buyer_clerk_id,
      amount: Number(req.query.vnp_Amount) / 100,
      payment_method: req.query.vnp_BankCode || "vnpay",
      payment_status,
      transaction_id: req.query.vnp_TransactionNo,
    });
    // Chuyển hướng theo kết quả
    if (payment_status === "completed") {
      return res.redirect("http://localhost:8800/payment-success");
    } else {
      return res.redirect("http://localhost:8800/payment-failed");
    }
  } catch (error) {
    console.error("❌ Lỗi xác minh callback VNPay:", error);
    console.error("🔍 Query từ VNPay:", req.query);
    return res.status(500).send("Lỗi callback VNPay");
  }
};
