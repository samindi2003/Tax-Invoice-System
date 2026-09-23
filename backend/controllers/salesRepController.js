const SalesRep = require('../models/SalesRep');

// Get all sales reps for a specific company
exports.getSalesReps = async (req, res) => {
    try {
        const companyId = req.headers['company-id'];
        if (!companyId) return res.status(400).json({ message: 'Company ID is required in headers' });

        const salesReps = await SalesRep.find({ companyId }).sort({ createdAt: -1 });
        res.status(200).json(salesReps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new sales rep
exports.createSalesRep = async (req, res) => {
    try {
        const companyId = req.headers['company-id'];
        if (!companyId) return res.status(400).json({ message: 'Company ID is required in headers' });

        const newSalesRep = new SalesRep({
            ...req.body,
            companyId
        });
        const savedSalesRep = await newSalesRep.save();
        res.status(201).json(savedSalesRep);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete sales rep
exports.deleteSalesRep = async (req, res) => {
    try {
        const salesRep = await SalesRep.findByIdAndDelete(req.params.id);
        if (!salesRep) {
            return res.status(404).json({ message: 'Sales Rep not found' });
        }
        res.status(200).json({ message: 'Sales Rep deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
