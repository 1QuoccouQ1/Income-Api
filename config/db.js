const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://bqgaming2004:123@cluster0.fiwvtnl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);


let dbConnection;

async function connectDB() {
    if (!dbConnection) {
        try {
            await client.connect();
            console.log('Connected successfully to MongoDB');
            dbConnection = client.db('mydatabase'); // Kết nối đến cơ sở dữ liệu mydatabase
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    }
    return dbConnection;
}

module.exports = connectDB;
