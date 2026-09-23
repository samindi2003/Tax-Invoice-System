const Customer = require('../models/Customer');

const getCompanyId = (req, res) => {
    const companyId = req.headers['company-id'];
    if (!companyId) {
        res.status(400).json({ message: 'Company ID is required in headers' });
        return null;
    }
    return companyId;
};

// @desc    Get all customers
// @route   GET /api/customers
// @access  Public
const getCustomers = async (req, res) => {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    try {
        const customers = await Customer.find({ companyId }).sort({ createdAt: -1 });
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single customer
// @route   GET /api/customers/:id
// @access  Public
const getCustomerById = async (req, res) => {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    try {
        const customer = await Customer.findOne({ _id: req.params.id, companyId });
        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a customer
// @route   POST /api/customers
// @access  Public
const createCustomer = async (req, res) => {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    const { tinNo, name, address, telephoneNo, email } = req.body;

    if (!name || !address) {
        return res.status(400).json({ message: 'Name and address are required' });
    }

    try {
        const customer = await Customer.create({
            companyId,
            tinNo,
            name,
            address,
            telephoneNo,
            email
        });
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Public
const updateCustomer = async (req, res) => {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    try {
        const customer = await Customer.findOne({ _id: req.params.id, companyId });

        if (customer) {
            customer.tinNo = req.body.tinNo || customer.tinNo;
            customer.name = req.body.name || customer.name;
            customer.address = req.body.address || customer.address;
            customer.telephoneNo = req.body.telephoneNo || customer.telephoneNo;
            customer.email = req.body.email || customer.email;

            const updatedCustomer = await customer.save();
            res.status(200).json(updatedCustomer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Public
const deleteCustomer = async (req, res) => {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    try {
        const customer = await Customer.findOneAndDelete({ _id: req.params.id, companyId });
        if (customer) {
            res.status(200).json({ message: 'Customer removed' });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};
