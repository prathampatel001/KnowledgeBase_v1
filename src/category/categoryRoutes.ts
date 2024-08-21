import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../category/categoryController';
import authorizeSuperUser from '../middlewares/authorization'; // Adjust the path as needed
import { authenticate } from '../middlewares/authentication';

const categoryRoute = Router();

// Route definitions with authorization middleware
categoryRoute.post('/add_category', authenticate, authorizeSuperUser, createCategory);
categoryRoute.get('/get_category', authenticate ,authorizeSuperUser, getAllCategories);
categoryRoute.get('/get_category/:id', authenticate, authorizeSuperUser, getCategoryById);
categoryRoute.put('/update_category/:id', authenticate, authorizeSuperUser, updateCategory);
categoryRoute.delete('/remove_category/:id', authenticate, authorizeSuperUser, deleteCategory);

export default categoryRoute;
