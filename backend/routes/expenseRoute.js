const express = require('express');
const {
  addData,
  getAllData,
  updateData,
  deleteData,
  getMonthlyTotals,
} = require('../controllers/expenseController');
const { tokenValidation } = require('../middlewares/tokenValidation');
const router = express.Router();

router.post('/add', tokenValidation, addData);

router.get('/getAll', tokenValidation, getAllData);

router.put('/update/:id', tokenValidation, updateData);

router.delete('/delete/:id', tokenValidation, deleteData);

//router.get('/getMonthlyTotals',tokenValidation,getMonthlyTotals)

module.exports = router;
