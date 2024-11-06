const express = require('express');
const { registerUser, loginUser, currentUser } = require('../controllers/userController');
const {tokenValidation}=require('../middlewares/tokenValidation')
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/current', tokenValidation,currentUser);

module.exports = router; 
