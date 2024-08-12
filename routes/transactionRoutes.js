const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');


// Lấy tất cả các transaction
router.post('/transactions', TransactionController.getAllGoats);
// Tạo một transaction mới
router.post('/Createtransaction', TransactionController.createGoat);

module.exports = router;
