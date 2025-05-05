import { models } from '../models/Sequelize-mysql.js';

// Tạo hồ sơ seeker
export const createSeekerProfile = async (req, res, next) => {
  try {
    const { clerk_id, first_name, last_name, current_salary, is_annually_monthly, currency, email_contact, file_cv } = req.body;
    if (!clerk_id || !first_name || !last_name) {
      return res.status(400).json({ success: false, message: 'Missing required fields: clerk_id, first_name, or last_name' });
    }
    const profile = await models.SeekerProfile.create({
      clerk_id,
      first_name,
      last_name,
      current_salary,
      is_annually_monthly,
      currency,
      email_contact,
      file_cv,
    });
    console.log(`Seeker profile created: clerk_id=${clerk_id}`);
    return res.status(201).json({ success: true, message: 'Seeker profile created successfully', profile });
  } catch (error) {
    console.error('Error creating seeker profile:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating seeker profile', error: error.message });
  }
};

// Lấy tất cả hồ sơ seeker (phân trang)
export const getAllSeekerProfiles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const profiles = await models.SeekerProfile.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    return res.status(200).json({
      success: true,
      total: profiles.count,
      pages: Math.ceil(profiles.count / limit),
      profiles: profiles.rows,
    });
  } catch (error) {
    console.error('Error fetching seeker profiles:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching seeker profiles', error: error.message });
  }
};

// Lấy hồ sơ seeker theo clerk_id
export const getSeekerProfileById = async (req, res, next) => {
  try {
    const { clerk_id } = req.params;
    const profile = await models.SeekerProfile.findByPk(clerk_id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Seeker profile not found' });
    }
    return res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error('Error fetching seeker profile:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching seeker profile', error: error.message });
  }
};

// Cập nhật hồ sơ seeker
export const updateSeekerProfile = async (req, res, next) => {
  try {
    const { clerk_id } = req.params;
    const { first_name, last_name, current_salary, is_annually_monthly, currency, email_contact, file_cv } = req.body;
    const profile = await models.SeekerProfile.findByPk(clerk_id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Seeker profile not found' });
    }
    await profile.update({
      first_name,
      last_name,
      current_salary,
      is_annually_monthly,
      currency,
      email_contact,
      file_cv,
    });
    console.log(`Seeker profile updated: clerk_id=${clerk_id}`);
    return res.status(200).json({ success: true, message: 'Seeker profile updated successfully', profile });
  } catch (error) {
    console.error('Error updating seeker profile:', error.message);
    return res.status(500).json({ success: false, message: 'Error updating seeker profile', error: error.message });
  }
};

// Xóa hồ sơ seeker
export const deleteSeekerProfile = async (req, res, next) => {
  try {
    const { clerk_id } = req.params;
    const profile = await models.SeekerProfile.findByPk(clerk_id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Seeker profile not found' });
    }
    await profile.destroy();
    console.log(`Seeker profile deleted: clerk_id=${clerk_id}`);
    return res.status(200).json({ success: true, message: 'Seeker profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting seeker profile:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting seeker profile', error: error.message });
  }
};