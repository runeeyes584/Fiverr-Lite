import { models, sequelize } from '../models/Sequelize-mysql.js';
import createError from '../utils/createError.js';

// Tạo đánh giá
export const createReview = async (req, res, next) => {
  try {
    const { order_id, gig_id, reviewer_clerk_id, rating, comment } = req.body;
    if (!order_id || !gig_id || !reviewer_clerk_id || !rating) {
      return res.status(400).json({ success: false, message: 'Missing required fields: order_id, gig_id, reviewer_clerk_id, or rating' });
    }
    const review = await models.Review.create({
      order_id,
      gig_id,
      reviewer_clerk_id,
      rating,
      comment,
    });
    console.log(`Review created: id=${review.id}`);
    return res.status(201).json({ success: true, message: 'Review created successfully', review });
  } catch (error) {
    console.error('Error creating review:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating review', error: error.message });
  }
};

// Lấy tất cả đánh giá (phân trang)
export const getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, gig_id, order_id } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (gig_id) where.gig_id = gig_id;
    if (order_id) where.order_id = order_id;

    const reviews = await models.Review.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    return res.status(200).json({
      success: true,
      total: reviews.count,
      pages: Math.ceil(reviews.count / limit),
      reviews: reviews.rows,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching reviews', error: error.message });
  }
};

// Lấy đánh giá theo ID
export const getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await models.Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    return res.status(200).json({ success: true, review });
  } catch (error) {
    console.error('Error fetching review:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching review', error: error.message });
  }
};

// Cập nhật đánh giá
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const review = await models.Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    await review.update({ rating, comment });
    console.log(`Review updated: id=${id}`);
    return res.status(200).json({ success: true, message: 'Review updated successfully', review });
  } catch (error) {
    console.error('Error updating review:', error.message);
    return res.status(500).json({ success: false, message: 'Error updating review', error: error.message });
  }
};

// Xóa đánh giá
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await models.Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    await review.destroy();
    console.log(`Review deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting review', error: error.message });
  }
};

// Mã bình luận (giữ nguyên để tham khảo)
// export const createReview = async (req, res, next) => {
//   if (req.isSeller)
//     return next(createError(403, "Sellers can't create a review!"));

//   try {
//     const review = await models.Review.findOne({
//       where: {
//         gigId: req.body.gigId,
//         userId: req.userId,
//       },
//     });

//     if (review)
//       return next(
//         createError(403, "You have already created a review for this gig!")
//       );

//     const newReview = await models.Review.create({
//       userId: req.userId,
//       gigId: req.body.gigId,
//       desc: req.body.desc,
//       star: req.body.star,
//     });

//     await models.Gig.update(
//       {
//         totalStars: sequelize.literal(`totalStars + ${req.body.star}`),
//         starNumber: sequelize.literal(`starNumber + 1`),
//       },
//       {
//         where: { id: req.body.gigId },
//       }
//     );

//     res.status(201).send(newReview);
//   } catch (err) {
//     next(err);
//   }
// };

// export const getReviews = async (req, res, next) => {
//   try {
//     const reviews = await models.Review.findAll({
//       where: { gigId: req.params.gigId },
//     });
//     res.status(200).send(reviews);
//   } catch (err) {
//     next(err);
//   }
// };

// export const deleteReview = async (req, res, next) => {
//   try {
//     const review = await models.Review.findByPk(req.params.id);
//     if (!review) return next(createError(404, "Review not found!"));
//     if (review.userId !== req.userId)
//       return next(createError(403, "You can only delete your own review!"));

//     await models.Gig.update(
//       {
//         totalStars: sequelize.literal(`totalStars - ${review.star}`),
//         starNumber: sequelize.literal(`starNumber - 1`),
//       },
//       {
//         where: { id: review.gigId },
//       }
//     );

//     await review.destroy();
//     res.status(200).send("Review has been deleted!");
//   } catch (err) {
//     next(err);
//   }
// };