const express = require('express');
const router = express.Router();
const salesRepController = require('../controllers/salesRepController');

// Routes for Sales Reps
router.get('/', salesRepController.getSalesReps);
router.post('/', salesRepController.createSalesRep);
router.delete('/:id', salesRepController.deleteSalesRep);

module.exports = router;
