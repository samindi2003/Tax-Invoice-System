const Product = require('../models/Product');

const getCompanyId = (req, res) => {
    const companyId = req.headers['company-id'];
    if (!companyId) {
        res.status(400).json({ message: 'Company ID is required in headers' });
        return null;
    }
    return companyId;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    try {
        const products = await Product.find({ companyId }).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    try {
        const product = await Product.findOne({ _id: req.params.id, companyId });
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    const { name, referenceNumber, poNumber, description, unitPrice, quantity, category, taxRate, salesRep, status } = req.body;

    if (!name || !description || !unitPrice) {
        return res.status(400).json({ message: 'Name, Description, and Unit Price are required' });
    }

    try {
        const product = await Product.create({
            companyId,
            name,
            referenceNumber,
            poNumber,
            description,
            unitPrice,
            quantity: quantity || 0,
            category: category || 'Product',
            taxRate: taxRate || 0,
            salesRep,
            status: status || 'Active'
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    try {
        const product = await Product.findOne({ _id: req.params.id, companyId });

        if (product) {
            product.name = req.body.name || product.name;
            product.referenceNumber = req.body.referenceNumber !== undefined ? req.body.referenceNumber : product.referenceNumber;
            product.poNumber = req.body.poNumber !== undefined ? req.body.poNumber : product.poNumber;
            product.description = req.body.description || product.description;
            product.unitPrice = req.body.unitPrice || product.unitPrice;
            product.quantity = req.body.quantity !== undefined ? req.body.quantity : product.quantity;
            product.category = req.body.category || product.category;
            product.taxRate = req.body.taxRate !== undefined ? req.body.taxRate : product.taxRate;
            product.salesRep = req.body.salesRep !== undefined ? req.body.salesRep : product.salesRep;
            product.status = req.body.status || product.status;

            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, companyId });
        if (product) {
            res.status(200).json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
