import { models } from '../models/Sequelize-mysql.js';

// Tạo kỹ năng cho gig
export const createGigSkill = async (req, res, next) => {
  try {
    const { gig_id, skill_id } = req.body;
    if (!gig_id || !skill_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields: gig_id or skill_id' });
    }
    const gigSkill = await models.GigSkill.create({ gig_id, skill_id });
    console.log(`Gig skill created: id=${gigSkill.id}`);
    return res.status(201).json({ success: true, message: 'Gig skill created successfully', gigSkill });
  } catch (error) {
    console.error('Error creating gig skill:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating gig skill', error: error.message });
  }
};

// Lấy tất cả kỹ năng của gig theo gig_id
export const getAllGigSkills = async (req, res, next) => {
  try {
    const { gig_id } = req.query;
    if (!gig_id) {
      return res.status(400).json({ success: false, message: 'Missing required query: gig_id' });
    }
    const gigSkills = await models.GigSkill.findAll({ where: { gig_id } });
    return res.status(200).json({ success: true, gigSkills });
  } catch (error) {
    console.error('Error fetching gig skills:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching gig skills', error: error.message });
  }
};

// Lấy kỹ năng của gig theo ID
export const getGigSkillById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const gigSkill = await models.GigSkill.findByPk(id);
    if (!gigSkill) {
      return res.status(404).json({ success: false, message: 'Gig skill not found' });
    }
    return res.status(200).json({ success: true, gigSkill });
  } catch (error) {
    console.error('Error fetching gig skill:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching gig skill', error: error.message });
  }
};

// Xóa kỹ năng của gig
export const deleteGigSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const gigSkill = await models.GigSkill.findByPk(id);
    if (!gigSkill) {
      return res.status(404).json({ success: false, message: 'Gig skill not found' });
    }
    await gigSkill.destroy();
    console.log(`Gig skill deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Gig skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting gig skill:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting gig skill', error: error.message });
  }
};