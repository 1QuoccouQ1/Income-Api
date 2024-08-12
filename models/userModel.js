const connectDB = require('../config/db');

const UserModel = {
    async getAllUsers() {
        const db = await connectDB();
        const collection = db.collection('UserAccounts');
        return collection.find({}).toArray();
    },

    async createUser(user) {
        const db = await connectDB();
        const collection = db.collection('UserAccounts');
        const result = await collection.insertOne(user);
        return result.insertedId;
    },
    async findOne(query) {
        const db = await connectDB();
        const collection = db.collection('UserAccounts'); // Đảm bảo tên collection chính xác
        return collection.findOne(query);
    },
    async updateUser(id, userData) {
        const db = await connectDB();
        const collection = db.collection('UserAccounts');

        // Cập nhật tài liệu dựa trên UserAccountID
        const result = await collection.updateOne(
            { UserAccountID: id }, // Điều kiện tìm kiếm
            { $set: userData }     // Dữ liệu cập nhật
        );

        if (result.matchedCount === 0) {
            throw new Error('User not found');
        }

        // Trả về tài liệu đã được cập nhật
        return collection.findOne({ UserAccountID: id });
    },
    async updatePass(email, userData) {
        const db = await connectDB();
        const collection = db.collection('UserAccounts');

        // Cập nhật tài liệu dựa trên UserAccountID
        const result = await collection.updateOne(
            { Email: email }, // Điều kiện tìm kiếm
            { $set: userData }     // Dữ liệu cập nhật
        );

        if (result.matchedCount === 0) {
            throw new Error('User not found');
        }

        // Trả về tài liệu đã được cập nhật
        return collection.findOne({ Email: email });
    },
     // Xóa một goat
     async deleteUser(id) {
        const db = await connectDB();
        const collection = db.collection('UserAccounts');

        // Xóa tài liệu dựa trên ID
        const result = await collection.deleteOne({ UserAccountID: id });

        if (result.deletedCount === 0) {
        throw new Error('User not found');
        }

        return { message: 'Goat deleted successfully' };
    },
};

module.exports = UserModel;
