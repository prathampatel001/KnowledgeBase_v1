import { Request, Response } from 'express';
import { z } from 'zod';
import Category from '../category/categoryModel'; // Adjust the import path as needed
import { IUser } from '../user/userModel'; // Adjust the import path as needed
import { AuthenticatedRequest } from '../middlewares/authentication'; // Adjust the import path as needed
import redisClient from '../config/redisDB';

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
            categoryCreatedBy: user.id, // Use ObjectId for reference
            isActive,
        });

        // Save to database using Mongoose
        const savedCategory = await newCategory.save();

        await redisClient?.del("allCategories");

        res.status(201).json(savedCategory);
    } catch (error) {
        console.error('Error creating category:', error); // Log the error for debugging purposes
        res.status(500).json({ message: 'Error creating category', error: error});
    }
};

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const cachedCategories = await redisClient?.get('allCategories');
        if (cachedCategories) {
            console.log('Returning cached categories');
            const parsedCategories = JSON.parse(cachedCategories);
            return res.status(200).json({
                categories: parsedCategories,   // Array of categories from cache
                count: parsedCategories.length, 
            });
        }

        const categories = await Category.find().populate('categoryCreatedBy', 'name email'); // Populate the creator's details
        const count = await Category.countDocuments(); // Get the count of documents in the collection
        
        await redisClient?.set('allCategories', JSON.stringify(categories), {
            EX: 1800, // Cache expires in 30 minutes
        });

        res.status(200).json({
            categories: categories,
            count: count
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error });
    }
};


// Get a single category by ID
export const getCategoryById = async (req: Request, res: Response) => {
    try {
        
        const { id } = req.params;

        const cacheKey = `singleCategory:${id}`;

        // Check if the category is cached
        const cachedCategory = await redisClient?.get(cacheKey);
        if (cachedCategory) {
            console.log('Returning cached category');
            return res.status(200).json(JSON.parse(cachedCategory));
        }

        const category = await Category.findById(id).populate('categoryCreatedBy', 'name email');

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await redisClient?.set(cacheKey, JSON.stringify(category), {
            EX: 1800, // Cache expires in 30 minutes
        });

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

        await redisClient?.del("allCategories");
        const categoryKey = `singleCategory:${id}`;
        await redisClient?.del(categoryKey);

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

        await redisClient?.del("allCategories");
        const categoryKey = `singleCategory:${id}`;
        await redisClient?.del(categoryKey);

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error});
    }
};
