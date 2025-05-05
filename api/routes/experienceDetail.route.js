import express from 'express';
import {createExperienceDetail, getAllExperienceDetails, getExperienceDetailById, deleteExperienceDetail, updateExperienceDetail} from '../controllers/experienceDetail.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách tất cả các experience detail
router.get('/', getAllExperienceDetails);
// Lấy experience detail theo id
router.get('/:id', getExperienceDetailById);
// Tạo experience detail mới
router.post('/', requireAuth, createExperienceDetail);
// Cập nhật experience detail
router.patch('/:id', requireAuth, updateExperienceDetail);
// Xóa experience detail
router.delete('/:id', requireAuth, deleteExperienceDetail);

export default router;