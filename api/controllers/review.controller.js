// import createError from "../utils/createError.js";
// import Review from "../models/review.model.js";
// import Gig from "../models/gig.model.js";

// export const createReview = async (req, res, next) => {
//   if (req.isSeller)
//     return next(createError(403, "Sellers can't create a review!"));

//   const newReview = new Review({
//     userId: req.userId,
//     gigId: req.body.gigId,
//     desc: req.body.desc,
//     star: req.body.star,
//   });
// // Tiến bị ngu
//   try {
//     const review = await Review.findOne({
//       gigId: req.body.gigId,
//       userId: req.userId,
//     });

//     if (review)
//       return next(
//         createError(403, "You have already created a review for this gig!")
//       );

//     //TODO: check if the user purchased the gig.

//     const savedReview = await newReview.save();

//     await Gig.findByIdAndUpdate(req.body.gigId, {
//       $inc: { totalStars: req.body.star, starNumber: 1 },
//     });
//     res.status(201).send(savedReview);
//   } catch (err) {
//     next(err);
//   }
// };

// export const getReviews = async (req, res, next) => {
//   try {
//     const reviews = await Review.find({ gigId: req.params.gigId });
//     res.status(200).send(reviews);
//   } catch (err) {
//     next(err);
//   }
// };
// export const deleteReview = async (req, res, next) => {
//   try {
//   } catch (err) {
//     next(err);
//   }
// };

import createError from "../utils/createError.js";
import { models } from "../models/mySQL-db.js";
import { sequelize } from "../models/mySQL-db.js";

export const createReview = async (req, res, next) => {
  if (req.isSeller)
    return next(createError(403, "Sellers can't create a review!"));

  try {
    const review = await models.Review.findOne({
      where: {
        gigId: req.body.gigId,
        userId: req.userId,
      },
    });

    if (review)
      return next(
        createError(403, "You have already created a review for this gig!")
      );

    const newReview = await models.Review.create({
      userId: req.userId,
      gigId: req.body.gigId,
      desc: req.body.desc,
      star: req.body.star,
    });

    await models.Gig.update(
      {
        totalStars: sequelize.literal(`totalStars + ${req.body.star}`),
        starNumber: sequelize.literal(`starNumber + 1`),
      },
      {
        where: { id: req.body.gigId },
      }
    );

    res.status(201).send(newReview);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await models.Review.findAll({
      where: { gigId: req.params.gigId },
    });
    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await models.Review.findByPk(req.params.id);
    if (!review) return next(createError(404, "Review not found!"));
    if (review.userId !== req.userId)
      return next(createError(403, "You can only delete your own review!"));

    await models.Gig.update(
      {
        totalStars: sequelize.literal(`totalStars - ${review.star}`),
        starNumber: sequelize.literal(`starNumber - 1`),
      },
      {
        where: { id: review.gigId },
      }
    );

    await review.destroy();
    res.status(200).send("Review has been deleted!");
  } catch (err) {
    next(err);
  }
};