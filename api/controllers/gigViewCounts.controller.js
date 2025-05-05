import { models } from '../models/Sequelize-mysql.js';

// Tạo bản ghi số lượt xem gig
export const createGigViewCount = async (req, res, next) => {
  try {
    const { gig_id, total_views } = req.body;
    if (!gig_id || !total_views) {
      return res.status(400).json({ success: false, message: 'Missing required fields: gig_id or total_views' });
    }
    const viewCount = await models.GigViewCount.create({ gig_id, total_views });
    console.log(`Gig view count created: gig_id=${gig_id}`);
    return res.status(201).json({ success: true, message: 'Gig view count created successfully', viewCount });
  } catch (error) {
    console.error('Error creating gig view count:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating gig view count', error: error.message });
  }
};

// Lấy tất cả bản ghi số lượt xem gig
export const getAllGigViewCounts = async (req, res, next) => {
  try {
    const viewCounts = await models.GigViewCount.findAll();
    return res.status(200).json({ success: true, viewCounts });
  } catch (error) {
    console.error('Error fetching gig view counts:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching gig view counts', error: error.message });
  }
};

// Lấy bản ghi số lượt xem gig theo ID
export const getGigViewCountById = async (req, res, next) => {
  try {
    const { gig_id } = req.params;
    const viewCount = await models.GigViewCount.findByPk(gig_id);
    if (!viewCount) {
      return res.status(404).json({ success: false, message: 'Gig view count not found' });
    }
    return res.status(200).json({ success: true, viewCount });
  } catch (error) {
    console.error('Error fetching gig view count:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching gig view count', error: error.message });
  }
};

// Cập nhật bản ghi số lượt xem gig
export const updateGigViewCount = async (req, res, next) => {
  try {
    const { gig_id } = req.params;
    const { total_views } = req.body;
    const viewCount = await models.GigViewCount.findByPk(gig_id);
    if (!viewCount) {
      return res.status(404).json({ success: false, message: 'Gig view count not found' });
    }
    await viewCount.update({ total_views });
    console.log(`Gig view count updated: gig_id=${gig_id}`);
    return res.status(200).json({ success: true, message: 'Gig view count updated successfully', viewCount });
  } catch (error) {
    console.error('Error updating gig view count:', error.message);
    return res.status(500).json({ success: false, message: 'Error updating gig view count', error: error.message });
  }
};

// Xóa bản ghi số lượt xem gig
export const deleteGigViewCount = async (req, res, next) => {
  try {
    const { gig_id } = req.params;
    const viewCount = await models.GigViewCount.findByPk(gig_id);
    if (!viewCount) {
      return res.status(404).json({ success: false, message: 'Gig view count not found' });
    }
    await viewCount.destroy();
    console.log(`Gig view count deleted: gig_id=${gig_id}`);
    return res.status(200).json({ success: true, message: 'Gig view count deleted successfully' });
  } catch (error) {
    console.error('Error deleting gig view count:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting gig view count', error: error.message });
  }
};