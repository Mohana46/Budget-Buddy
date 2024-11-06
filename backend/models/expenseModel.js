const mongoose = require('mongoose');

// Expense Schema
const expenseSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, 
  type: { 
    type: String,
    required: [true, "Transaction type is required"],
    enum: ['Income', 'Expense']
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Entertainment', 'Bills', 'Rent', 'Other','Salary','Investments','Freelance','Pension'] 
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
