const express = require('express');
const router = express.Router();
const PlanController = require('../controllers/planController');

// Route để lấy tất cả goats
router.post('/plans', PlanController.getAllGoats);
// Tao goat
router.post('/Createplan', PlanController.createGoat);

// Tim goat theo id
router.post('/Findplan', PlanController.getGoatById);

// Route để cập nhật một goat
router.put('/Updateplan', PlanController.updateGoat); // Xử lý yêu cầu PUT với ID và dữ liệu cần cập nhật

// Route để xóa một goat
router.delete('/Deleteplan', PlanController.deleteGoat); 

module.exports = router;
