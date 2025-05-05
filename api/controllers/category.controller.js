import { models } from '../models/Sequelize-mysql.js';

// Tạo danh mục
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Missing required field: name' });
    }
    const category = await models.Category.create({ name });
    console.log(`Category created: id=${category.id}`);
    return res.status(201).json({ success: true, message: 'Category created successfully', category });
  } catch (error) {
    console.error('Error creating category:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating category', error: error.message });
  }
};

// Lấy tất cả danh mục
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await models.Category.findAll();
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching categories', error: error.message });
  }
};

// Lấy danh mục theo ID
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await models.Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.status(200).json({ success: true, category });
  } catch (error) {
    console.error('Error fetching category:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching category', error: error.message });
  }
};

// Cập nhật danh mục
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await models.Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await category.update({ name });
    console.log(`Category updated: id=${id}`);
    return res.status(200).json({ success: true, message: 'Category updated successfully', category });
  } catch (error) {
    console.error('Error updating category:', error.message);
    return res.status(500).json({ success: false, message: 'Error updating category', error: error.message });
  }
};

// Xóa danh mục
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await models.Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await category.destroy();
    console.log(`Category deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting category', error: error.message });
  }
};