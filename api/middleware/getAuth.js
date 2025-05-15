import { models } from "../models/Sequelize-mysql.js";

export const authenticateAndLoadUser = async (req, res, next) => {
  if (!req.auth || !req.auth.userId) {
    console.error("authenticateAndLoadUser: req.auth.userId is missing. requireAuth (Clerk) might not have run or failed.");
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      const err = new Error("No authorization token provided");
      err.status = 401;
      return next(err);
    }
    // Fallback tạm thời (cần thay bằng logic decode token Clerk)
    req.auth = { userId: token }; // Thay bằng logic decode token để lấy clerk_id
    console.warn("Falling back to token header for userId. Please integrate proper Clerk authentication.");
  }
  const clerkId = req.auth.userId;
  try {
    const user = await models.User.findOne({
      where: { clerk_id: clerkId },
      attributes: ['id', 'clerk_id', 'user_role']
    });
    if (!user) {
      console.error(`authenticateAndLoadUser: User with clerk_id ${clerkId} not found in application database.`);
      const err = new Error("User (authenticated by token) not found in application database.");
      err.status = 401;
      return next(err);
    }
    req.user = user.toJSON();
    console.log(`User ${clerkId} loaded from DB with role: ${req.user.user_role}`);
    next();
  } catch (error) {
    console.error("authenticateAndLoadUser: Error loading user from database:", error);
    const err = new Error("Failed to load user information from database.");
    err.status = 500;
    next(err);
  }
};

export const isSeller = (req, res, next) => {
  if (!req.user || !req.user.user_role) {
    console.error("isSeller: req.user or req.user.user_role is missing. Ensure authenticateAndLoadUser runs first and loads user_role.");
    const err = new Error("User role information is not available for seller check due to a preceding middleware issue.");
    err.status = 500;
    return next(err);
  }
  if (req.user.user_role !== 'seller') {
    console.warn(`isSeller: Access denied for user ${req.user.clerk_id}. Role '${req.user.user_role}' is not 'seller'.`);
    const err = new Error("Forbidden: Seller access required.");
    err.status = 403;
    return next(err);
  }
  console.log(`isSeller: Seller access granted for user ${req.user.clerk_id}`);
  next();
};

export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.user_role) {
    console.error("isAdmin: req.user or req.user.user_role is missing. Ensure authenticateAndLoadUser runs first and loads user_role.");
    const err = new Error("User role information is not available for admin check due to a preceding middleware issue.");
    err.status = 500;
    return next(err);
  }
  if (req.user.user_role !== 'admin') {
    console.warn(`isAdmin: Access denied for user ${req.user.clerk_id}. Role '${req.user.user_role}' is not 'admin'.`);
    const err = new Error("Forbidden: Admin access required.");
    err.status = 403;
    return next(err);
  }
  console.log(`isAdmin: Admin access granted for user ${req.user.clerk_id}`);
  next();
};