import { models } from '../models/Sequelize-mysql.js';

// Tạo công ty
export const createCompany = async (req, res, next) => {
  try {
    const { clerk_id, company_name, profile_description, establishment_date, company_website_url, company_email, location } = req.body;
    if (!clerk_id || !company_name) {
      return res.status(400).json({ success: false, message: 'Missing required fields: clerk_id or company_name' });
    }
    const company = await models.Company.create({
      clerk_id,
      company_name,
      profile_description,
      establishment_date,
      company_website_url,
      company_email,
      location,
    });
    console.log(`Company created: id=${company.id}`);
    return res.status(201).json({ success: true, message: 'Company created successfully', company });
  } catch (error) {
    console.error('Error creating company:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating company', error: error.message });
  }
};

// Lấy tất cả công ty (phân trang)
export const getAllCompanies = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const companies = await models.Company.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    return res.status(200).json({
      success: true,
      total: companies.count,
      pages: Math.ceil(companies.count / limit),
      companies: companies.rows,
    });
  } catch (error) {
    console.error('Error fetching companies:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching companies', error: error.message });
  }
};

// Lấy công ty theo ID
export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await models.Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    return res.status(200).json({ success: true, company });
  } catch (error) {
    console.error('Error fetching company:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching company', error: error.message });
  }
};

// Cập nhật công ty
export const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { company_name, profile_description, establishment_date, company_website_url, company_email, location } = req.body;
    const company = await models.Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    await company.update({
      company_name,
      profile_description,
      establishment_date,
      company_website_url,
      company_email,
      location,
    });
    console.log(`Company updated: id=${id}`);
    return res.status(200).json({ success: true, message: 'Company updated successfully', company });
  } catch (error) {
    console.error('Error updating company:', error.message);
    return res.status(500).json({ success: false, message: 'Error updating company', error: error.message });
  }
};

// Xóa công ty
export const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await models.Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    await company.destroy();
    console.log(`Company deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting company', error: error.message });
  }
};