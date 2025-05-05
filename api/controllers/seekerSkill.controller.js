import { models } from '../models/Sequelize-mysql.js';

// Tạo kỹ năng của seeker
export const createSeekerSkill = async (req, res, next) => {
  try {
    const { clerk_id, skill_id } = req.body;
    if (!clerk_id || !skill_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields: clerk_id or skill_id' });
    }
    const seekerSkill = await models.SeekerSkill.create({ clerk_id, skill_id });
    console.log(`Seeker skill created: id=${seekerSkill.id}`);
    return res.status(201).json({ success: true, message: 'Seeker skill created successfully', seekerSkill });
  } catch (error) {
    console.error('Error creating seeker skill:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating seeker skill', error: error.message });
  }
};

// Lấy tất cả kỹ năng của seeker
export const getAllSeekerSkills = async (req, res, next) => {
  try {
    const { clerk_id } = req.query;
    if (!clerk_id) {
      return res.status(400).json({ success: false, message: 'Missing required query: clerk_id' });
    }
    const seekerSkills = await models.SeekerSkill.findAll({ where: { clerk_id } });
    return res.status(200).json({ success: true, seekerSkills });
  } catch (error) {
    console.error('Error fetching seeker skills:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching seeker skills', error: error.message });
  }
};

// Lấy kỹ năng của seeker theo ID
export const getSeekerSkillById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const seekerSkill = await models.SeekerSkill.findByPk(id);
    if (!seekerSkill) {
      return res.status(404).json({ success: false, message: 'Seeker skill not found' });
    }
    return res.status(200).json({ success: true, seekerSkill });
  } catch (error) {
    console.error('Error fetching seeker skill:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching seeker skill', error: error.message });
  }
};

// Xóa kỹ năng của seeker
export const deleteSeekerSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const seekerSkill = await models.SeekerSkill.findByPk(id);
    if (!seekerSkill) {
      return res.status(404).json({ success: false, message: 'Seeker skill not found' });
    }
    await seekerSkill.destroy();
    console.log(`Seeker skill deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Seeker skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting seeker skill:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting seeker skill', error: error.message });
  }
};

//câp nhật kỹ năng seeker
export const updateSeekerSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { clerk_id, skill_id } = req.body;
    const seekerSkill = await models.SeekerSkill.findByPk(id);
    if (!seekerSkill) {
      return res.status(404).json({ success: false, message: 'Seeker skill not found' });
    }
    await seekerSkill.update({ clerk_id, skill_id });
    console.log(`Seeker skill updated: id=${id}`);
    return res.status(200).json({ success: true, message: 'Seeker skill updated successfully', seekerSkill });
  } catch (error) {
    console.error('Error updating seeker skill:', error.message);
    return res.status(500).json({ success: false, message: 'Error updating seeker skill', error: error.message });
  }
};