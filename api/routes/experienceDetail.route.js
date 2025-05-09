import express from 'express';
import {createExperienceDetail, getAllExperienceDetails, deleteExperienceDetail, updateExperienceDetail} from '../controllers/experienceDetail.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();



// Lấy danh sách experience detail theo clerk_id
router.get('/clerk/:clerk_id', getAllExperienceDetails);
// Tạo experience detail mới theo clerk_id
router.post('/', requireAuth, createExperienceDetail);
// Cập nhật experience detail
router.patch('/:id', requireAuth, updateExperienceDetail);
// Xóa experience detail
router.delete('/:id', requireAuth, deleteExperienceDetail);

export default router;