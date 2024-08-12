const connectDB = require('../config/db');

const GoatModel = {
    async getAllUsers() {
        const db = await connectDB();
        const collection = db.collection('Goats');
        return collection.find({}).toArray();
    },

    async createUser(user) {
        const db = await connectDB();
        const collection = db.collection('Goats');
        const result = await collection.insertOne(user);
        return result.insertedId;
    },
    async findOne(query) {
        const db = await connectDB();
        const collection = db.collection('Goats'); // Đảm bảo tên collection chính xác
        return collection.findOne(query);
    },
    async findAll(query) {
        const db = await connectDB();
        const collection = db.collection('Goats'); // Đảm bảo tên collection chính xác
        return collection.find(query).toArray();
    },
    async UpdateUsers(id, userData) {
        try {
            const db = await connectDB();
        const collection = db.collection('Goats');
        // Cập nhật tài liệu dựa trên UserAccountID
        const result = await collection.updateOne(
            { GoalID: id }, // Điều kiện tìm kiếm
            { $set: userData }     // Dữ liệu cập nhật
        );
        
        // Trả về tài liệu đã được cập nhật
        return collection.findOne({ GoalID: id });
            
        } catch (error) {
            throw new Error(error);
        }
        
    },
    // Xóa một goat
    async deleteGoat(id) {
        const db = await connectDB();
        const collection = db.collection('Goats');

        // Xóa tài liệu dựa trên ID
        const result = await collection.deleteOne({ GoalID: id });

        if (result.deletedCount === 0) {
        throw new Error('Goat not found');
        }

        return { message: 'Goat deleted successfully' };
    },
};

module.exports = GoatModel;
