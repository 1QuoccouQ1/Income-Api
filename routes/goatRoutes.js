const express = require('express');
const router = express.Router();
const GoatController = require('../controllers/goatController');

// Route để lấy tất cả goats
router.post('/goats', GoatController.getAllGoats);
// Tao goat
router.post('/Creategoat', GoatController.createGoat);

// Tim goat theo id
router.post('/Findgoat', GoatController.getGoatById);

// Route để cập nhật một goat
router.put('/Updategoat', GoatController.updateGoat); // Xử lý yêu cầu PUT với ID và dữ liệu cần cập nhật

// Route để xóa một goat
router.delete('/Deletegoat', GoatController.deleteGoat); 

module.exports = router;
