import { models } from '../models/Sequelize-mysql.js';

// Tạo kỹ năng
export const createSkill = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Missing required field: name' });
    }
    const skill = await models.Skills.create({ name });
    console.log(`Skill created: id=${skill.id}`);
    return res.status(201).json({ success: true, message: 'Skill created successfully', skill });
  } catch (error) {
    console.error('Error creating skill:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating skill', error: error.message });
  }
};

// Lấy tất cả kỹ năng
export const getAllSkills = async (req, res, next) => {
  try {
    const skills = await models.Skills.findAll();
    return res.status(200).json({ success: true, skills });
  } catch (error) {
    console.error('Error fetching skills:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching skills', error: error.message });
  }
};

// Lấy kỹ năng theo ID
export const getSkillById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await models.Skills.findByPk(id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    return res.status(200).json({ success: true, skill });
  } catch (error) {
    console.error('Error fetching skill:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching skill', error: error.message });
  }
};

// Cập nhật kỹ năng
export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const skill = await models.Skills.findByPk(id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    await skill.update({ name });
    console.log(`Skill updated: id=${id}`);
    return res.status(200).json({ success: true, message: 'Skill updated successfully', skill });
  } catch (error) {
    console.error('Error updating skill:', error.message);
    return res.status(500).json({ success: false, message: 'Error updating skill', error: error.message });
  }
};

// Xóa kỹ năng
export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await models.Skills.findByPk(id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    await skill.destroy();
    console.log(`Skill deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting skill', error: error.message });
  }
};