import { models } from '../models/Sequelize-mysql.js';

// Tạo biểu mẫu liên hệ
export const createContactForm = async (req, res, next) => {
  try {
    const { clerk_id, name, email, message } = req.body;
    if (!clerk_id || !name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const form = await models.ContactForm.create({ clerk_id, name, email, message });
    console.log(`Contact form created: id=${form.id}`);
    return res.status(201).json({ success: true, message: 'Contact form submitted successfully', form });
  } catch (error) {
    console.error('Error submitting contact form:', error.message);
    return res.status(500).json({ success: false, message: 'Error submitting contact form', error: error.message });
  }
};

// Lấy tất cả biểu mẫu liên hệ (phân trang)
// export const getAllContactForms = async (req, res, next) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;
//     const forms = await models.ContactForm.findAndCountAll({
//       limit: parseInt(limit),
//       offset: parseInt(offset),
//     });
//     return res.status(200).json({
//       success: true,
//       total: forms.count,
//       pages: Math.ceil(forms.count / limit),
//       forms: forms.rows,
//     });
//   } catch (error) {
//     console.error('Error fetching contact forms:', error.message);
//     return res.status(500).json({ success: false, message: 'Error fetching contact forms', error: error.message });
//   }
// };

// Lấy tất cả biểu mẫu liên hệ theo clerk_id
export const getContactFormsByUser = async (req, res, next) => {
  try {
    const { clerk_id } = req.params;
    if (!clerk_id) {
      console.warn('Validation failed: Missing required parameter clerk_id');
      return res.status(400).json({ success: false, message: 'Missing required parameter: clerk_id' });
    }
    const forms = await models.ContactForm.findAll({ where: { clerk_id } });
    return res.status(200).json({ success: true, forms });
  } catch (error) {
    console.error('Error fetching contact forms:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching contact forms', error: error.message });
  }
};

// Cập nhật biểu mẫu liên hệ
export const updateContactForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, message } = req.body;
    const form = await models.ContactForm.findByPk(id);
    if (!form) {
      return res.status(404).json({ success: false, message: 'Contact form not found' });
    }
    await form.update({ name, email, message });
    console.log(`Contact form updated: id=${id}`);
    return res.status(200).json({ success: true, message: 'Contact form updated successfully', form });
  } catch (error) {
    console.error('Error updating contact form:', error.message);
    return res.status(500).json({ success: false, message: 'Error updating contact form', error: error.message });
  }
};

// Xóa biểu mẫu liên hệ
export const deleteContactForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = await models.ContactForm.findByPk(id);
    if (!form) {
      return res.status(404).json({ success: false, message: 'Contact form not found' });
    }
    await form.destroy();
    console.log(`Contact form deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Contact form deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact form:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting contact form', error: error.message });
  }
};