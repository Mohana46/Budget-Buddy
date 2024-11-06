const Expense = require('../models/expenseModel'); 
const User = require('../models/userModel'); 

// Add Expense Controller
exports.addData = async (req, res) => {
  try {
    const { amount, description, date, category, userId, type } = req.body;

    // Validate required fields
    if (!amount || !description || !category || !type) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create a new Expense
    const newExpense = await Expense.create({
      amount,
      description,
      date,
      category,
      userID: userId,
      type,
    });

    return res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Expenses for a User
exports.getAllData = async (req, res) => {
  try {
    const { userId, type, startDate, endDate } = req.query; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Construct query based on filters
    const query = { userID: userId };
    if (type && type !== 'all') {
      query.type = type;
    }
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const expenses = await Expense.find(query);
    return res.status(200).json({
      success: true,
      expenses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Expense Controller
exports.updateData = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const { amount, description, date, category, type } = req.body;

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Update fields if provided
    if (amount) expense.amount = amount;
    if (description) expense.description = description;
    if (category) expense.category = category;
    if (type) expense.type = type; 
    if (date) expense.date = new Date(date);

    await expense.save();

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Expense Controller
exports.deleteData = async (req, res) => {
  try {
    const expenseId = req.params.id;
    
    const expense = await Expense.findByIdAndDelete(expenseId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// //////////////////////////////////////////
// // Get Monthly Totals for a User
// exports.getMonthlyTotals = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     // Check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Aggregation pipeline to get monthly totals for type "Expense"
//     const monthlyTotals = await Expense.aggregate([
//       {
//         $match: {
//           userID: userId, // Filter by user ID
//           type: "Expense" // Filter by type "Expense"
//         },
//       },
//       {
//         $group: {
//           _id: { $month: "$date" }, // Group by month
//           total: { $sum: "$amount" }, // Sum amounts
//         },
//       },
//       {
//         $sort: { _id: 1 }, // Sort by month
//       },
//     ]);

//     // Initialize an array for each month with zeros
//     const totalsArray = new Array(12).fill(0);
//     monthlyTotals.forEach(item => {
//       totalsArray[item._id - 1] = item.total; // item._id is the month (1-12)
//     });

//     return res.status(200).json({
//       success: true,
//       monthlyTotals: totalsArray,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

