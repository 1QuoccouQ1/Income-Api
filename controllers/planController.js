const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Plan = require('../models/planModel'); // Đảm bảo đường dẫn đúng

const PlanController = {
  // Lấy danh sách tất cả goats
  getAllGoats: async (req, res) => {
    const { UserAccountID } = req.body;
    console.log(UserAccountID);
    try {
      const goats = await Plan.findAll({ UserAccountID : UserAccountID});
      res.status(200).json(goats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Tạo một goat mới
  createGoat: async (req, res) => {
    try {
      const newGoat = await Plan.createUser(req.body);
      res.status(201).json(newGoat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getGoatById(req, res) {
      const { id } = req.body;
      try {
          const user = await Plan.findOne({ CategoryID : id});// findById tự động xử lý ObjectId
          if (!user) { 
              return res.status(404).json({ message: 'Plan not found' });
          }
          res.status(200).json(user);
      } catch (error) {
          res.status(500).send('Error retrieving Plan');
      }
  },
  // Cập nhật một goat
  updateGoat: async (req, res) => {
    try {
      const { id, ...goatData } = req.body;
      const updatedGoat = await Plan.UpdateUsers( id, { ...goatData });
      if (!updatedGoat) {
        return res.status(404).json({ message: 'Plan not found' });
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
      const deletedGoat = await Plan.deleteGoat(id);
      if (!deletedGoat) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = PlanController;
