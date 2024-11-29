import express from 'express';
import { getCustomItems, createCustomItem, updateCustomItem, deleteCustomItem } from '../controllers/customItemController';
// import { authMiddleware } from '../middleware/authMiddleware';


const router = express.Router();

router.get('/', getCustomItems);
router.post('/', createCustomItem);
router.put('/:id', updateCustomItem);
router.delete('/:id', deleteCustomItem);

export default router;
