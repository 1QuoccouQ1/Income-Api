const CategoryModel = require('../models/categoryModel');

const CategoryController = {
    async getCategories(req, res) {
        try {
            const categories = await CategoryModel.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).send('Error fetching categories');
        }
    },

    async createCategory(req, res) {
        const { name } = req.body;
        try {
            const categoryId = await CategoryModel.createCategory({ name });
            res.status(201).json({ categoryId });
        } catch (error) {
            res.status(500).send('Error creating category');
        }
    }
};

module.exports = CategoryController;
