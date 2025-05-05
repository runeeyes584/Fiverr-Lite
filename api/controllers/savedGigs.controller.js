import { models } from '../models/Sequelize-mysql.js';

// Lưu gig
export const createSavedGig = async (req, res, next) => {
  try {
    const { clerk_id, gig_id } = req.body;
    if (!clerk_id || !gig_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields: clerk_id or gig_id' });
    }
    const savedGig = await models.SavedGig.create({ clerk_id, gig_id });
    console.log(`Gig saved: id=${savedGig.id}`);
    return res.status(201).json({ success: true, message: 'Gig saved successfully', savedGig });
  } catch (error) {
    console.error('Error saving gig:', error.message);
    return res.status(500).json({ success: false, message: 'Error saving gig', error: error.message });
  }
};

// Lấy tất cả gig đã lưu (phân trang)
export const getAllSavedGigs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, clerk_id } = req.query;
    if (!clerk_id) {
      return res.status(400).json({ success: false, message: 'Missing required query: clerk_id' });
    }
    const offset = (page - 1) * limit;
    const savedGigs = await models.SavedGig.findAndCountAll({
      where: { clerk_id },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    return res.status(200).json({
      success: true,
      total: savedGigs.count,
      pages: Math.ceil(savedGigs.count / limit),
      savedGigs: savedGigs.rows,
    });
  } catch (error) {
    console.error('Error fetching saved gigs:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching saved gigs', error: error.message });
  }
};

// Lấy gig đã lưu theo ID
export const getSavedGigById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const savedGig = await models.SavedGig.findByPk(id);
    if (!savedGig) {
      return res.status(404).json({ success: false, message: 'Saved gig not found' });
    }
    return res.status(200).json({ success: true, savedGig });
  } catch (error) {
    console.error('Error fetching saved gig:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching saved gig', error: error.message });
  }
};

// Xóa gig đã lưu
export const deleteSavedGig = async (req, res, next) => {
  try {
    const { id } = req.params;
    const savedGig = await models.SavedGig.findByPk(id);
    if (!savedGig) {
      return res.status(404).json({ success: false, message: 'Saved gig not found' });
    }
    await savedGig.destroy();
    console.log(`Saved gig deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Saved gig deleted successfully' });
  } catch (error) {
    console.error('Error deleting saved gig:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting saved gig', error: error.message });
  }
};