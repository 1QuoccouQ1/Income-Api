const connectDB = require('../config/db');

const TransactionModel = {
    async findAll(query) {
        const db = await connectDB();
        const collection = db.collection('Transactions'); // Đảm bảo tên collection chính xác
        return collection.find(query).toArray();
    },
    async createUser(user) {
        const db = await connectDB();
        const collection = db.collection('Transactions');
        const result = await collection.insertOne(user);
        return result.insertedId;
    },
};

module.exports = TransactionModel;
