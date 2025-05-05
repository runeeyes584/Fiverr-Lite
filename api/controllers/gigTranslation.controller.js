import { models } from '../models/Sequelize-mysql.js';

// Tạo bản dịch gig
export const createGigTranslation = async (req, res, next) => {
  try {
    const { gig_id, language_code, title, description } = req.body;
    if (!gig_id || !language_code) {
      return res.status(400).json({ success: false, message: 'Missing required fields: gig_id or language_code' });
    }
    const translation = await models.GigTranslation.create({ gig_id, language_code, title, description });
    console.log(`Gig translation created: id=${translation.id}`);
    return res.status(201).json({ success: true, message: 'Gig translation created successfully', translation });
  } catch (error) {
    console.error('Error creating gig translation:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating gig translation', error: error.message });
  }
};

// Lấy tất cả bản dịch gig theo gig_id
export const getAllGigTranslations = async (req, res, next) => {
  try {
    const { gig_id } = req.query;
    if (!gig_id) {
      return res.status(400).json({ success: false, message: 'Missing required query: gig_id' });
    }
    const translations = await models.GigTranslation.findAll({ where: { gig_id } });
    return res.status(200).json({ success: true, translations });
  } catch (error) {
    console.error('Error fetching gig translations:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching gig translations', error: error.message });
  }
};

// Lấy bản dịch gig theo ID
export const getGigTranslationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const translation = await models.GigTranslation.findByPk(id);
    if (!translation) {
      return res.status(404).json({ success: false, message: 'Gig translation not found' });
    }
    return res.status(200).json({ success: true, translation });
  } catch (error) {
    console.error('Error fetching gig translation:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching gig translation', error: error.message });
  }
};

// Cập nhật bản dịch gig
export const updateGigTranslation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const translation = await models.GigTranslation.findByPk(id);
    if (!translation) {
      return res.status(404).json({ success: false, message: 'Gig translation not found' });
    }
    await translation.update({ title, description });
    console.log(`Gig translation updated: id=${id}`);
    return res.status(200).json({ success: true, message: 'Gig translation updated successfully', translation });
  } catch (error) {
    console.error('Error updating gig translation:', error.message);
    return res.status(500).json({ success: false, message: 'Error updating gig translation', error: error.message });
  }
};

// Xóa bản dịch gig
export const deleteGigTranslation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const translation = await models.GigTranslation.findByPk(id);
    if (!translation) {
      return res.status(404).json({ success: false, message: 'Gig translation not found' });
    }
    await translation.destroy();
    console.log(`Gig translation deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Gig translation deleted successfully' });
  } catch (error) {
    console.error('Error deleting gig translation:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting gig translation', error: error.message });
  }
};