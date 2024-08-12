const connectDB = require('../config/db');

const PlanModel = {
    async getAllUsers() {
        const db = await connectDB();
        const collection = db.collection('Categories');
        return collection.find({}).toArray();
    },

    async createUser(user) {
        const db = await connectDB();
        const collection = db.collection('Categories');
        const result = await collection.insertOne(user);
        return result.insertedId;
    },
    async findOne(query) {
        const db = await connectDB();
        const collection = db.collection('Categories'); // Đảm bảo tên collection chính xác
        return collection.findOne(query);
    },
    async findAll(query) {
        const db = await connectDB();
        const collection = db.collection('Categories'); // Đảm bảo tên collection chính xác
        return collection.find(query).toArray();
    },
    async UpdateUsers(id, userData) {
        try {
            const db = await connectDB();
        const collection = db.collection('Categories');
        // Cập nhật tài liệu dựa trên UserAccountID
        const result = await collection.updateOne(
            { CategoryID: id }, // Điều kiện tìm kiếm
            { $set: userData }     // Dữ liệu cập nhật
        );
        
        // Trả về tài liệu đã được cập nhật
        return collection.findOne({ CategoryID: id });
            
        } catch (error) {
            throw new Error(error);
        }
        
    },
    // Xóa một goat
    async deleteGoat(id) {
        const db = await connectDB();
        const collection = db.collection('Categories');

        // Xóa tài liệu dựa trên ID
        const result = await collection.deleteOne({ CategoryID: id });

        if (result.deletedCount === 0) {
        throw new Error('Plan not found');
        }

        return { message: 'Plan deleted successfully' };
    },
};

module.exports = PlanModel;
