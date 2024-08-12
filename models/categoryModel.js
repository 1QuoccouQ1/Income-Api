const connectDB = require('../config/db');

const CategoryModel = {
    async getAllCategories() {
        const db = await connectDB();
        const collection = db.collection('Categories');
        return collection.find({}).toArray();
    },

    async createCategory(category) {
        const db = await connectDB();
        const collection = db.collection('Categories');
        const result = await collection.insertOne(category);
        return result.insertedId;
    }
};

module.exports = CategoryModel;
