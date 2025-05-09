import { models } from '../models/Sequelize-mysql.js';

// Tạo chi tiết kinh nghiệm
export const createExperienceDetail = async (req, res, next) => {
  try {
    const clerk_id = req.user.clerk_id; // Lấy clerk_id từ req.user (requireAuth)
    const { certificate_degree_name, major, cgpa, start_date, end_date, is_current_job, job_title, company_name, location, description } = req.body;
    
    // Yêu cầu các trường bắt buộc
    if (!job_title || !company_name || !start_date) {
      console.warn('Validation failed: Missing required fields: job_title, company_name, or start_date');
      return res.status(400).json({ success: false, message: 'Missing required fields: job_title, company_name, or start_date' });
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
    const { clerk_id } = req.params; // Sử dụng params thay vì query
    if (!clerk_id) {
      console.warn('Validation failed: Missing required parameter clerk_id');
      return res.status(400).json({ success: false, message: 'Missing required parameter: clerk_id' });
    }
    const experiences = await models.ExperienceDetail.findAll({ where: { clerk_id } });
    return res.status(200).json({ success: true, experiences });
  } catch (error) {
    console.error('Error fetching experiences:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching experiences', error: error.message });
  }
};

// Cập nhật chi tiết kinh nghiệm
export const updateExperienceDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const clerk_id = req.user.clerk_id; // Lấy clerk_id từ req.user
    const { certificate_degree_name, major, cgpa, start_date, end_date, is_current_job, job_title, company_name, location, description } = req.body;

    const experience = await models.ExperienceDetail.findByPk(id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    // Kiểm tra quyền sở hữu
    if (experience.clerk_id !== clerk_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You can only update your own experience' });
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
    const clerk_id = req.user.clerk_id; // Lấy clerk_id từ req.user

    const experience = await models.ExperienceDetail.findByPk(id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    // Kiểm tra quyền sở hữu
    if (experience.clerk_id !== clerk_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You can only delete your own experience' });
    }

    await experience.destroy();
    console.log(`Experience deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting experience', error: error.message });
  }
};