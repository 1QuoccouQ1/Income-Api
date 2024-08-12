const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("447909669027-dpct81pbd6v051eq2s4hmmdhr25isv9j.apps.googleusercontent.com");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyParser = require('body-parser');

// 



// Hàm xác thực thông tin người dùng từ Google
const verifyGoogleToken = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '447909669027-dpct81pbd6v051eq2s4hmmdhr25isv9j.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();
    return payload;
};


const UserController = {
    async getUsers(req, res) {
        try {
            const users = await UserModel.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async createUser(req, res) {
        try {
            const newUser = req.body;
            const insertedId = await UserModel.createUser(newUser);
            res.status(201).json({ insertedId });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async register(req, res) {
        // Đăng ký người dùng
        const { username, email, password ,UserAccountID } = req.body;
        // Thực hiện logic đăng ký người dùng
        try {

            const user = await UserModel.findOne({ Email: email });
            if (user) {
                return res.status(400).json({ message: 'Đã có tài khoản email ', status : 400 });
            }

            const userId = await UserModel.createUser(
                { UserAccountID : UserAccountID , UserName:username, Email:email, Password:password , CurrentBalance: 0, TotalSpent:0 , TotalReceived :0 ,isAdmin : false ,Address : "", Phone :"",FullName : ""   }
            );
            res.status(201).json({ userId , status : 200 });
        } catch (error) {
            res.status(500).send('Error registering user');
        }
    },

    async login(req, res) {
        const { email, password } = req.body;
        
        try {
            // Tìm người dùng theo Email
            const user = await UserModel.findOne({ Email: email });
            if (!user) {
                return res.status(400).json({ message: 'Ko có email ' });
            }

            // // So sánh mật khẩu đã băm với mật khẩu nhập vào
            // const isMatch = await bcrypt.compare(password, user.Password);
            // if (!isMatch) {
            //     return res.status(400).json({ message: 'Invalid email or password' });
            // }

            // So sánh mật khẩu văn bản thuần túy
            if (password !== user.Password) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Tạo JWT token
            const UserID = user.UserAccountID;

            const isAdmin = user.isAdmin;
            const UserName = user.UserName;
            
            const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });

            // Trả về token cho người dùng
            res.status(200).json({ token , UserID ,isAdmin ,UserName });
        } catch (error) {
            res.status(500).send('Error logging in user');
        }
    },
    async getUserById(req, res) {
        const { id } = req.body;
        try {
            const user = await UserModel.findOne({ UserAccountID : id});// findById tự động xử lý ObjectId
            if (!user) { 
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).send('Error retrieving user');
        }
    },
    async UpdateUser(req, res) {
        const { id, ...userData } = req.body;
        try {
            if (!id || !userData) {
                return res.status(400).json({ message: 'ID and user data are required' });
            }
    
             // Cập nhật tài liệu dựa trên UserAccountID và trả về tài liệu đã được cập nhật
             const user = await UserModel.updateUser(id, userData);
    
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error updating user');
        }
    },
    async AuthToken(req, res) {
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({ isValid: false, message: 'Token không tồn tại' });
          }
        
          // Kiểm tra tính hợp lệ của token
          jwt.verify(token,"secretKey", (err, user) => {
            if (err) {
              return res.status(403).json({ isValid: false, message: 'Token không hợp lệ' });
            }
            // Lưu thông tin người dùng vào request để các middleware hoặc route handler sau có thể sử dụng
             res.json({ isValid: true });
          });
    },
    async DeleteUser(req, res) {
        const { id } = req.body;
        try {
            const user = await UserModel.deleteUser(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).send('Error deleting user');
        }
    },
    async googleLogin(req, res) {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        try {
            // Xác thực token với Google
            const googleUser = await verifyGoogleToken(token);

            // Kiểm tra người dùng trong cơ sở dữ liệu
            const existingUser = await UserModel.findOne({ google_id: googleUser.sub });

            if (existingUser) {
                // Người dùng đã tồn tại, tạo token và trả về
                const UserID = existingUser.google_id;

                const isAdmin = existingUser.isAdmin;
                const UserName = existingUser.UserName;

                const authToken = jwt.sign({ userId: existingUser._id }, 'secretKey', { expiresIn: '1h' });
                return res.status(200).json({ token: authToken, UserID :UserID   ,isAdmin :isAdmin  ,UserName :UserName });
            }

            // Người dùng chưa tồn tại, tạo tài khoản mới
            const newUser = {
                google_id: googleUser.sub,
                Email: googleUser.email,
                profile_picture: googleUser.picture,
                UserAccountID: googleUser.sub, // Có thể thay đổi theo nhu cầu
                UserName: googleUser.name,
                Password: '', // Không cần mật khẩu nếu đăng nhập qua Google
                CurrentBalance: 0,
                TotalSpent: 0,
                TotalReceived: 0,
                isAdmin: false,
                Address: '',
                Phone: '',
                FullName: googleUser.name,
            };

            const createdUser = await UserModel.createUser(newUser);

            const newUsers = await UserModel.findOne({ google_id: googleUser.sub });
                
            const UserID = newUsers.google_id;

            const isAdmin = newUsers.isAdmin;
            const UserName = newUsers.UserName;

            const authToken = jwt.sign({ userId: newUsers._id }, 'secretKey', { expiresIn: '1h' });

            res.status(201).json({ token: authToken, UserID :UserID   ,isAdmin :isAdmin  ,UserName :UserName });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error during Google login');
        }
    },
    async ForgotPassword(req, res) {
        const { email } = req.body;
        try {
            const user = await UserModel.findOne({ Email:email });

            if (!user) {
            return res.status(404).send('User not found.');
            }

            const token = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 giờ


            const Newuser = await UserModel.updatePass(email , user);


            const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'bybit25052004@gmail.com',
                pass: 'zscj sjhq yoqp csrl',
            },
            });

            const mailOptions = {
            to: user.Email,
            from: 'bybit25052004@gmail.com',
            subject: 'Password Reset',
            html: ` <div style="font-family: Arial, sans-serif; color: #333;">
                        <p>You are receiving this because you (or someone else) have requested to reset your password.</p>
                        <p>Please click on the following link, or paste this into your browser, to complete the process:</p>
                        <p><a href='http://localhost:5173/reset-password?token=${token}' style="color: #1a73e8; text-decoration: none; font-weight: bold;">Reset Password Now</a></p>
                        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                    </div>`,
            };

            await transporter.sendMail(mailOptions);
            res.status(200).send('Password reset link sent.');
        } catch (error) {
            res.status(500).send('Error occurred.');
            console.error(error);
        }
    },
    async ResetPassword(req, res) {
        const { token, password } = req.body;


        try {
          const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
          });
      
          if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
          }
      
          user.Password = password; // Đảm bảo bạn mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
      

          const Newuser = await UserModel.updatePass(user.Email , user);


          res.status(200).send('Password successfully updated.');
        } catch (error) {
          res.status(500).send('Error occurred.');
        }
    }
};

module.exports = UserController;
