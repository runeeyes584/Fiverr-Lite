import { models } from '../models/Sequelize-mysql.js';

// Tạo chi tiết kinh nghiệm
export const createExperienceDetail = async (req, res, next) => {
  try {
    const { clerk_id, certificate_degree_name, major, cgpa, start_date, end_date, is_current_job, job_title, company_name, location, description } = req.body;
    if (!clerk_id || !job_title) {
      return res.status(400).json({ success: false, message: 'Missing required fields: clerk_id or job_title' });
    }
    const experience = await models.ExperienceDetail.create({
      clerk_id,
      certificate_degree_name,
      major,
      cgpa,
      start_date,
      end_date,
      is_current_job,
      job_title,
      company_name,
      location,
      description,
    });
    console.log(`Experience created: id=${experience.id}`);
    return res.status(201).json({ success: true, message: 'Experience created successfully', experience });
  } catch (error) {
    console.error('Error creating experience:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating experience', error: error.message });
  }
};

// Lấy tất cả chi tiết kinh nghiệm theo clerk_id
export const getAllExperienceDetails = async (req, res, next) => {
  try {
    const { clerk_id } = req.query;
    if (!clerk_id) {
      return res.status(400).json({ success: false, message: 'Missing required query: clerk_id' });
    }
    const experiences = await models.ExperienceDetail.findAll({ where: { clerk_id } });
    return res.status(200).json({ success: true, experiences });
  } catch (error) {
    console.error('Error fetching experiences:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching experiences', error: error.message });
  }
};

// Lấy chi tiết kinh nghiệm theo ID
export const getExperienceDetailById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const experience = await models.ExperienceDetail.findByPk(id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }
    return res.status(200).json({ success: true, experience });
  } catch (error) {
    console.error('Error fetching experience:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching experience', error: error.message });
  }
};

// Cập nhật chi tiết kinh nghiệm
export const updateExperienceDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { certificate_degree_name, major, cgpa, start_date, end_date, is_current_job, job_title, company_name, location, description } = req.body;
    const experience = await models.ExperienceDetail.findByPk(id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }
    await experience.update({
      certificate_degree_name,
      major,
      cgpa,
      start_date,
      end_date,
      is_current_job,
      job_title,
      company_name,
      location,
      description,
    });
    console.log(`Experience updated: id=${id}`);
    return res.status(200).json({ success: true, message: 'Experience updated successfully', experience });
  } catch (error) {
    console.error('Error updating experience:', error.message);
    return res.status(500).json({ success: false, message: 'Error updating experience', error: error.message });
  }
};

// Xóa chi tiết kinh nghiệm
export const deleteExperienceDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const experience = await models.ExperienceDetail.findByPk(id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }
    await experience.destroy();
    console.log(`Experience deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting experience', error: error.message });
  }
};