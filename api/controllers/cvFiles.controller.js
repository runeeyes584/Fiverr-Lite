import { models } from '../models/Sequelize-mysql.js';

const validateCVFile = (data) => {
  const errors = {};
  if (!data.clerk_id) errors.clerk_id = "Clerk ID is required";
  if (!data.file_url) errors.file_url = "File URL is required";
  if (!data.file_name) errors.file_name = "File name is required";
  return Object.keys(errors).length > 0 ? errors : null;
};

export const createCVFile = async (req, res) => {
  const errors = validateCVFile(req.body);
  if (errors) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    const cvFile = await models.CVFile.create(req.body);
    return res.status(201).json({ success: true, message: 'CV file created successfully', cvFile });
  } catch (error) {
    console.error('Error creating CV file:', error);
    return res.status(500).json({ success: false, message: 'Error creating CV file', error: error.message });
  }
};

export const getCVFilesByClerkId = async (req, res) => {
  try {
    const { clerk_id } = req.params;
    const cvFiles = await models.CVFile.findAll({
      where: { clerk_id: clerk_id }
    });
    return res.status(200).json({ success: true, cvFiles });
  } catch (error) {
    console.error('Error getting CV files:', error);
    return res.status(500).json({ success: false, message: 'Error getting CV files', error: error.message });
  }
};

export const getCVFileById = async (req, res) => {
  try {
    const { id } = req.params;
    const cvFile = await models.CVFile.findByPk(id);
    if (!cvFile) {
      return res.status(404).json({ success: false, message: 'CV file not found' });
    }
    return res.status(200).json({ success: true, cvFile });
  } catch (error) {
    console.error('Error getting CV file by ID:', error);
    return res.status(500).json({ success: false, message: 'Error getting CV file by ID', error: error.message });
  }
};

export const updateCVFile = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validateCVFile(req.body);
    if (errors) {
      return res.status(400).json({ success: false, errors });
    }

    const result = await models.CVFile.update(req.body, {
      where: { id: id }
    });

    if (result[0] === 0) {
      return res.status(404).json({ success: false, message: 'CV file not found' });
    }

    const updatedCVFile = await models.CVFile.findByPk(id);
    return res.status(200).json({ success: true, message: 'CV file updated successfully', cvFile: updatedCVFile });

  } catch (error) {
    console.error('Error updating CV file:', error);
    return res.status(500).json({ success: false, message: 'Error updating CV file', error: error.message });
  }
};

export const deleteCVFile = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await models.CVFile.destroy({
      where: { id: id }
    });
    if (result === 0) {
      return res.status(404).json({ success: false, message: 'CV file not found' });
    }
    return res.status(200).json({ success: true, message: 'CV file deleted successfully' });
  } catch (error) {
    console.error('Error deleting CV file:', error);
    return res.status(500).json({ success: false, message: 'Error deleting CV file', error: error.message });
  }
};