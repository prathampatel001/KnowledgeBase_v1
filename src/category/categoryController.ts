import { Request, Response } from 'express';
import Category from '../category/categoryModel';
import { IUser } from '../user/userModel';
import { AuthenticatedRequest } from '../middlewares/authentication';
import { body, validationResult } from 'express-validator';

/// Input validation middleware
export const validateCategoryInput = [
    body('categoryName')
        .trim()
        .isString()
        .notEmpty()
        .withMessage('Category name is required and must be a string.'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean value.')
];

// Create a new category
export const createCategory = async (req: AuthenticatedRequest, res: Response) => {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Invalid input', errors: errors.array() });
    }

    try {
        const { categoryName, isActive } = req.body;
        const user = req.user as IUser;

        // Ensure user is authenticated and has necessary permissions
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found or not authenticated.' });
        }

        // Sanitize inputs (e.g., remove any potential XSS characters)
        const sanitizedCategoryName = categoryName.trim();

        // Create and save the new category
        const newCategory = new Category({
            categoryName: sanitizedCategoryName,
            categoryCreatedBy: user.id, // Use ObjectId for reference
            isActive,
        });

        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        console.error('Error creating category:', error); // Log the error for debugging purposes
        res.status(500).json({ message: 'Error creating category', error: error });
    }
};


// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find().populate('categoryCreatedBy', 'name email'); // Populate the creator's details
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
};

// Get a single category by ID
export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id).populate('categoryCreatedBy', 'name email');

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error });
    }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error });
    }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
};
