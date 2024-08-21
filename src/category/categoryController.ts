import { Request, Response } from 'express';
import { z } from 'zod';
import Category from '../category/categoryModel'; // Adjust the import path as needed
import { IUser } from '../user/userModel'; // Adjust the import path as needed
import { AuthenticatedRequest } from '../middlewares/authentication'; // Adjust the import path as needed

// Define Zod schema for category input validation
const categorySchema = z.object({
    categoryName: z.string().min(1, 'Category name is required.'),
    isActive: z.boolean().optional(),
});

// Create a new category
export const createCategory = async (req: AuthenticatedRequest, res: Response) => {
    // Input validation
    try {
        const parsed = categorySchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: 'Invalid input', errors: parsed.error.format() });
        }

        const { categoryName, isActive } = parsed.data;

        // Ensure user is authenticated and has necessary permissions
        const user = req.user as IUser;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found or not authenticated.' });
        }

        // Create and save the new category
        const newCategory = new Category({
            categoryName: categoryName.trim(), // Sanitize by trimming
            categoryCreatedBy: user._id, // Use ObjectId for reference
            isActive,
        });

        // Save to database using Mongoose
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        console.error('Error creating category:', error); // Log the error for debugging purposes
        res.status(500).json({ message: 'Error creating category', error: error});
    }
};

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find().populate('categoryCreatedBy', 'name email'); // Populate the creator's details
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error});
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
        res.status(500).json({ message: 'Error fetching category', error: error });
    }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const parsed = categorySchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: 'Invalid input', errors: parsed.error.format() });
        }

        const updatedData = parsed.data;

        const updatedCategory = await Category.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error});
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
        res.status(500).json({ message: 'Error deleting category', error: error});
    }
};
