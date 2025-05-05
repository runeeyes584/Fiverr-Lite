import { models } from '../models/Sequelize-mysql.js';

// Tạo file CV
export const createCVFile = async (req, res, next) => {
  try {
    const { clerk_id, file_url, file_name, is_default, file_size, file_type } = req.body;
    if (!clerk_id || !file_url) {
      return res.status(400).json({ success: false, message: 'Missing required fields: clerk_id or file_url' });
    }
    const cv = await models.CVFile.create({
      clerk_id,
      file_url,
      file_name,
      is_default,
      file_size,
      file_type,
    });
    console.log(`CV file created: id=${cv.id}`);
    return res.status(201).json({ success: true, message: 'CV file created successfully', cv });
  } catch (error) {
    console.error('Error creating CV file:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating CV file', error: error.message });
  }
};

// Lấy tất cả file CV theo clerk_id
export const getAllCVFiles = async (req, res, next) => {
  try {
    const { clerk_id } = req.query;
    if (!clerk_id) {
      return res.status(400).json({ success: false, message: 'Missing required query: clerk_id' });
    }
    const cvs = await models.CVFile.findAll({ where: { clerk_id } });
    return res.status(200).json({ success: true, cvs });
  } catch (error) {
    console.error('Error fetching CV files:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching CV files', error: error.message });
  }
};

// Lấy file CV theo ID
export const getCVFileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cv = await models.CVFile.findByPk(id);
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV file not found' });
    }
    return res.status(200).json({ success: true, cv });
  } catch (error) {
    console.error('Error fetching CV file:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching CV file', error: error.message });
  }
};

// Cập nhật file CV
export const updateCVFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { file_url, file_name, is_default, file_size, file_type } = req.body;
    const cv = await models.CVFile.findByPk(id);
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV file not found' });
    }
    await cv.update({ file_url, file_name, is_default, file_size, file_type });
    console.log(`CV file updated: id=${id}`);
    return res.status(200).json({ success: true, message: 'CV file updated successfully', cv });
  } catch (error) {
    console.error('Error updating CV file:', error.message);
    return res.status(500).json({ success: false, message: 'Error updating CV file', error: error.message });
  }
};

// Xóa file CV
export const deleteCVFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cv = await models.CVFile.findByPk(id);
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV file not found' });
    }
    await cv.destroy();
    console.log(`CV file deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'CV file deleted successfully' });
  } catch (error) {
    console.error('Error deleting CV file:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting CV file', error: error.message });
  }
};