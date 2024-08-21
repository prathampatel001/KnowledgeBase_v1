import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../category/categoryController';
import authorizeSuperUser from '../middlewares/authorization'; // Adjust the path as needed

const categoryRoute = Router();

// Route definitions with authorization middleware
categoryRoute.post('/category/add', authorizeSuperUser, createCategory);
categoryRoute.get('/category/get' ,authorizeSuperUser, getAllCategories);
categoryRoute.get('/category/get/:id', authorizeSuperUser, getCategoryById);
categoryRoute.put('/category/update/:id', authorizeSuperUser, updateCategory);
categoryRoute.delete('/category/remove/:id', authorizeSuperUser, deleteCategory);

export default categoryRoute;
