const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// Routes for companies
router.get('/', companyController.getCompanies);
router.post('/', companyController.createCompany);
router.get('/:id', companyController.getCompany);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);
router.post('/:id/verify', companyController.verifyPassword);

module.exports = router;
