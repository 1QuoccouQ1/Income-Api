const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
// Lấy tất cả các user
router.get('/user', UserController.getUsers);
// Tìm User theo ID
router.post('/Finduser', UserController.getUserById);
// Cập nhật thông tin User
router.put('/UpdateUser', UserController.UpdateUser);
// Tạo một user mới
router.post('/register', UserController.register);
// Xóa một user
router.delete('/DeleteUser', UserController.DeleteUser);
// Đăng nhập
router.post('/login', UserController.login);

router.post('/AuthToken', UserController.AuthToken);

router.post('/forgot-password', UserController.ForgotPassword);

router.post('/reset-password', UserController.ResetPassword);

router.post('/send-phone', UserController.SendPhone);

// router.post('/reset-passwordphone', UserController.PasswordPhone);


// Đăng nhập bằng Google
router.post('/google', UserController.googleLogin);

module.exports = router;
