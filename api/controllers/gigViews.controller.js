import { models } from '../models/Sequelize-mysql.js';

// Tạo lượt xem gig
export const createGigView = async (req, res, next) => {
  try {
    const { gig_id, clerk_id } = req.body;
    if (!gig_id || !clerk_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields: gig_id or clerk_id' });
    }
    const view = await models.GigView.create({ gig_id, clerk_id });
    console.log(`Gig view created: id=${view.id}`);
    return res.status(201).json({ success: true, message: 'Gig view created successfully', view });
  } catch (error) {
    console.error('Error creating gig view:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating gig view', error: error.message });
  }
};

// Lấy tất cả lượt xem gig (phân trang)
export const getAllGigViews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, gig_id } = req.query;
    if (!gig_id) {
      return res.status(400).json({ success: false, message: 'Missing required query: gig_id' });
    }
    const offset = (page - 1) * limit;
    const views = await models.GigView.findAndCountAll({
      where: { gig_id },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    return res.status(200).json({
      success: true,
      total: views.count,
      pages: Math.ceil(views.count / limit),
      views: views.rows,
    });
  } catch (error) {
    console.error('Error fetching gig views:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching gig views', error: error.message });
  }
};

// Lấy lượt xem gig theo ID
export const getGigViewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const view = await models.GigView.findByPk(id);
    if (!view) {
      return res.status(404).json({ success: false, message: 'Gig view not found' });
    }
    return res.status(200).json({ success: true, view });
  } catch (error) {
    console.error('Error fetching gig view:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching gig view', error: error.message });
  }
};

// Xóa lượt xem gig
export const deleteGigView = async (req, res, next) => {
  try {
    const { id } = req.params;
    const view = await models.GigView.findByPk(id);
    if (!view) {
      return res.status(404).json({ success: false, message: 'Gig view not found' });
    }
    await view.destroy();
    console.log(`Gig view deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Gig view deleted successfully' });
  } catch (error) {
    console.error('Error deleting gig view:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting gig view', error: error.message });
  }
};