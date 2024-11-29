import express from 'express';
import { getBuilders, createBuilder, updateBuilder, deleteBuilder } from '../controllers/builderController';
// import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getBuilders);
router.post('/', createBuilder);
router.put('/:id', updateBuilder);
router.delete('/:id', deleteBuilder);

export default router;
