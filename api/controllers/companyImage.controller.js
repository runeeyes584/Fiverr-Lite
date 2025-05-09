import { models } from '../models/Sequelize-mysql.js';

// Tạo ảnh công ty
export const createCompanyImage = async (req, res, next) => {
  try {
    const { company_id } = req.params;
    const { company_image } = req.body;
    if (!company_id || !company_image) {
      console.warn('Validation failed: Missing required fields: company_id or company_image');
      return res.status(400).json({ success: false, message: 'Missing required fields: company_id or company_image' });
    }
    const image = await models.CompanyImage.create({ company_id, company_image });
    console.log(`Company image created: id=${image.id}`);
    return res.status(201).json({ success: true, message: 'Company image created successfully', image });
  } catch (error) {
    console.error('Error creating company image:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating company image', error: error.message });
  }
};

// Lấy tất cả ảnh công ty theo company_id
export const getAllCompanyImages = async (req, res, next) => {
  try {
    const { company_id } = req.params;
    if (!company_id) {
      console.warn('Validation failed: Missing required parameter company_id');
      return res.status(400).json({ success: false, message: 'Missing required parameter: company_id' });
    }
    const images = await models.CompanyImage.findAll({ where: { company_id } });
    return res.status(200).json({ success: true, images });
  } catch (error) {
    console.error('Error fetching company images:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching company images', error: error.message });
  }
};

// Cập nhật ảnh công ty
export const updateCompanyImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { company_image } = req.body;
    const image = await models.CompanyImage.findByPk(id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Company image not found' });
    }
    await image.update({ company_image });
    console.log(`Company image updated: id=${id}`);
    return res.status(200).json({ success: true, message: 'Company image updated successfully', image });
  } catch (error) {
    console.error('Error updating company image:', error.message);
    return res.status(500).json({ success: false, message: 'Error updating company image', error: error.message });
  }
};

// Xóa ảnh công ty
export const deleteCompanyImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await models.CompanyImage.findByPk(id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Company image not found' });
    }
    await image.destroy();
    console.log(`Company image deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Company image deleted successfully' });
  } catch (error) {
    console.error('Error deleting company image:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting company image', error: error.message });
  }
};