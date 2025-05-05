import { models } from '../models/Sequelize-mysql.js';

// Tạo loại công việc
export const createJobType = async (req, res, next) => {
  try {
    const { job_type } = req.body;
    if (!job_type) {
      return res.status(400).json({ success: false, message: 'Missing required field: job_type' });
    }
    const type = await models.JobType.create({ job_type });
    console.log(`Job type created: id=${type.id}`);
    return res.status(201).json({ success: true, message: 'Job type created successfully', type });
  } catch (error) {
    console.error('Error creating job type:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating job type', error: error.message });
  }
};

// Lấy tất cả loại công việc
export const getAllJobTypes = async (req, res, next) => {
  try {
    const types = await models.JobType.findAll();
    return res.status(200).json({ success: true, types });
  } catch (error) {
    console.error('Error fetching job types:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching job types', error: error.message });
  }
};

// Lấy loại công việc theo ID
export const getJobTypeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const type = await models.JobType.findByPk(id);
    if (!type) {
      return res.status(404).json({ success: false, message: 'Job type not found' });
    }
    return res.status(200).json({ success: true, type });
  } catch (error) {
    console.error('Error fetching job type:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching job type', error: error.message });
  }
};

// Cập nhật loại công việc
export const updateJobType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { job_type } = req.body;
    const type = await models.JobType.findByPk(id);
    if (!type) {
      return res.status(404).json({ success: false, message: 'Job type not found' });
    }
    await type.update({ job_type });
    console.log(`Job type updated: id=${id}`);
    return res.status(200).json({ success: true, message: 'Job type updated successfully', type });
  } catch (error) {
    console.error('Error updating job type:', error.message);
    return res.status(500).json({ success: false, message: 'Error updating job type', error: error.message });
  }
};

// Xóa loại công việc
export const deleteJobType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const type = await models.JobType.findByPk(id);
    if (!type) {
      return res.status(404).json({ success: false, message: 'Job type not found' });
    }
    await type.destroy();
    console.log(`Job type deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Job type deleted successfully' });
  } catch (error) {
    console.error('Error deleting job type:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting job type', error: error.message });
  }
};