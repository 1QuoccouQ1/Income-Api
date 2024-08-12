const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
// Lấy tất cả các category
router.get('/', CategoryController.getCategories);
// Tạo một category mới
router.post('/', CategoryController.createCategory);

module.exports = router;
