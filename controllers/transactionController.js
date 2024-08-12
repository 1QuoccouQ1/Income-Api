const TransactionModel = require('../models/transactionModel');

const TransactionController = {
    getAllGoats: async (req, res) => {
        const { UserAccountID } = req.body;
        try {
          const goats = await TransactionModel.findAll({ UserAccountID : UserAccountID});
          res.status(200).json(goats);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    },
    createGoat: async (req, res) => {
    try {
        const newGoat = await TransactionModel.createUser(req.body);
        res.status(201).json(newGoat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    },
};

module.exports = TransactionController;
