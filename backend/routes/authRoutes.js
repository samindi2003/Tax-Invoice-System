const express = require('express');
const router = express.Router();
const { authUser, getUserProfile, updatePassword } = require('../controllers/authController');

router.post('/login', authUser);
router.get('/profile', getUserProfile);
router.put('/password', updatePassword);

module.exports = router;
