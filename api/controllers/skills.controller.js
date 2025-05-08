import { models } from '../models/Sequelize-mysql.js';

export const createSkill = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      const error = new Error("Skill name is required and must be a non-empty string.");
      error.status = 400;
      return next(error);
    }
    const trimmedName = name.trim();
    const newSkill = await models.Skills.create({ name: trimmedName });
    console.log(`Skill created: id=${newSkill.id}`);
    res.status(201).json({ success: true, message: 'Skill created successfully', skill: newSkill });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const err = new Error(`Skill name '${req.body.name}' already exists.`);
      err.status = 409;
      return next(err);
    }
    console.error('Error creating skill:', error.message);
    next(error);
  }
};

export const getAllSkills = async (req, res, next) => {
  try {
    const skills = await models.Skills.findAll({
      attributes: ['id', 'name']
    });
    res.status(200).json({ success: true, skills });
  } catch (error) {
    console.error('Error fetching skills:', error.message);
    next(error);
  }
};

export const getSkillById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await models.Skills.findByPk(id, {
      attributes: ['id', 'name']
    });
    if (!skill) {
      const error = new Error('Skill not found');
      error.status = 404;
      return next(error);
    }
    res.status(200).json({ success: true, skill });
  } catch (error) {
    console.error('Error fetching skill by ID:', error.message);
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      const error = new Error("Skill name is required and must be a non-empty string.");
      error.status = 400;
      return next(error);
    }
    const trimmedName = name.trim();
    const skill = await models.Skills.findByPk(id);
    if (!skill) {
      const error = new Error('Skill not found');
      error.status = 404;
      return next(error);
    }
    skill.name = trimmedName;
    await skill.save();
    console.log(`Skill updated: id=${id}`);
    res.status(200).json({ success: true, message: 'Skill updated successfully', skill });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const err = new Error(`Skill name '${req.body.name}' already exists.`);
      err.status = 409;
      return next(err);
    }
    console.error('Error updating skill:', error.message);
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  const skillId = req.params.id;
  try {
    const skill = await models.Skills.findByPk(skillId);
    if (!skill) {
      const error = new Error('Skill not found');
      error.status = 404;
      return next(error);
    }

    // KIỂM TRA RÀNG BUỘC
    const seekerSkillCount = await models.SeekerSkill.count({ where: { skill_id: skillId } });
    const gigSkillCount = await models.GigSkill.count({ where: { skill_id: skillId } });

    if (seekerSkillCount > 0 || gigSkillCount > 0) {
      console.warn(`Deletion prevented for skill ID ${skillId}: Used by ${seekerSkillCount} seekers and ${gigSkillCount} gigs.`);
      const error = new Error(`Cannot delete skill because it is currently used by ${seekerSkillCount} seeker profile(s) and ${gigSkillCount} gig(s).`);
      error.status = 409;
      return next(error);
    }

    await skill.destroy();
    console.log(`Skill deleted: id=${skillId}`);
    res.status(204).send();
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        console.warn(`Deletion failed for skill ID ${skillId} due to DB foreign key constraint.`);
        const err = new Error("Cannot delete skill due to database constraints (referenced by other records).");
        err.status = 409;
       return next(err);
     }
    console.error('Error deleting skill:', error.message);
    next(error);
  }
};
