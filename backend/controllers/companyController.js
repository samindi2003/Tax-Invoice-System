const Company = require('../models/Company');

// Get all companies
exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.find().sort({ createdAt: -1 });
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single company by ID
exports.getCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new company
exports.createCompany = async (req, res) => {
    try {
        const newCompany = new Company(req.body);
        const savedCompany = await newCompany.save();
        res.status(201).json(savedCompany);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update company
exports.updateCompany = async (req, res) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(updatedCompany);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete company
exports.deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify company password
exports.verifyPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const company = await Company.findById(req.params.id);
        
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // If company has no password, always allow
        if (!company.password) {
            return res.status(200).json({ success: true, message: 'Verified' });
        }

        // Compare plain text password
        if (company.password === password) {
            return res.status(200).json({ success: true, message: 'Verified' });
        } else {
            return res.status(401).json({ success: false, message: 'Incorrect password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
