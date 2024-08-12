const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Goat = require('../models/goatModel'); // Đảm bảo đường dẫn đúng

const GoatController = {
  // Lấy danh sách tất cả goats
  getAllGoats: async (req, res) => {
    const { UserAccountID } = req.body;
    console.log(UserAccountID);
    try {
      const goats = await Goat.findAll({ UserAccountID : UserAccountID});
      res.status(200).json(goats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Tạo một goat mới
  createGoat: async (req, res) => {
    try {
      const newGoat = await Goat.createUser(req.body);
      res.status(201).json(newGoat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getGoatById(req, res) {
      const { id } = req.body;
      try {
          const user = await Goat.findOne({ GoalID : id});// findById tự động xử lý ObjectId
          if (!user) { 
              return res.status(404).json({ message: 'User not found' });
          }
          res.status(200).json(user);
      } catch (error) {
          res.status(500).send('Error retrieving user');
      }
  },
  // Cập nhật một goat
  updateGoat: async (req, res) => {
    try {
      const { id, ...goatData } = req.body;
      const updatedGoat = await Goat.UpdateUsers( id, { ...goatData });
      if (!updatedGoat) {
        return res.status(404).json({ message: 'Goat not found' });
      }
      res.status(200).json(updatedGoat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa một goat
  deleteGoat: async (req, res) => {
    try {
      const { id } = req.body;
      const deletedGoat = await Goat.deleteGoat(id);
      if (!deletedGoat) {
        return res.status(404).json({ message: 'Goat not found' });
      }
      res.status(200).json({ message: 'Goat deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = GoatController;
