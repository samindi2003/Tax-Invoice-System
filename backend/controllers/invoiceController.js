const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

const getCompanyId = (req, res) => {
    const companyId = req.headers['company-id'];
    if (!companyId) {
        res.status(400).json({ message: 'Company ID is required in headers' });
        return null;
    }
    return companyId;
};

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Public
const getInvoices = async (req, res) => {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    try {
        const invoices = await Invoice.find({ companyId })
            .populate('customer', 'name tinNo')
            .sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Public
const getInvoiceById = async (req, res) => {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, companyId })
            .populate('customer')
            .populate('products.product');

        if (invoice) {
            res.json(invoice);
        } else {
            res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Public
const createInvoice = async (req, res) => {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    try {
        const { customer, products, date, invoiceNo: manualInvoiceNo, poNumber, salesRep } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No invoice items' });
        }

        // Generate Invoice Number if not provided
        let finalInvoiceNo = manualInvoiceNo;
        if (!finalInvoiceNo) {
            const count = await Invoice.countDocuments({ companyId });
            finalInvoiceNo = `INV-${String(count + 1).padStart(4, '0')}`;
        }

        // Validate products and calculate amounts server-side for security
        let subtotal = 0;
        const validatedProducts = await Promise.all(products.map(async (item) => {
            const product = await Product.findOne({ _id: item.product, companyId });
            if (!product) {
                throw new Error(`Product not found or does not belong to this company: ${item.product}`);
            }
            
            const amount = item.quantity * product.unitPrice;
            subtotal += amount;

            return {
                product: product._id,
                quantity: item.quantity,
                unitPrice: product.unitPrice,
                amount: amount
            };
        }));

        const vatAmount = subtotal * 0.18; // 18% VAT
        const grandTotal = subtotal + vatAmount;

        const invoice = new Invoice({
            companyId,
            invoiceNo: finalInvoiceNo,
            poNumber,
            salesRep,
            date: date || Date.now(),
            customer,
            products: validatedProducts,
            subtotal,
            vatAmount,
            grandTotal,
            status: 'Pending'
        });

        const createdInvoice = await invoice.save();
        res.status(201).json(createdInvoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Public
const deleteInvoice = async (req, res) => {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    try {
        const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, companyId });
        if (invoice) {
            res.status(200).json({ message: 'Invoice removed' });
        } else {
            res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Public
const updateInvoice = async (req, res) => {
    const companyId = getCompanyId(req, res);
    if (!companyId) return;

    try {
        const { customer, products, date, invoiceNo: manualInvoiceNo, poNumber, salesRep } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No invoice items' });
        }

        const invoiceToUpdate = await Invoice.findOne({ _id: req.params.id, companyId });
        if (!invoiceToUpdate) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Validate products and calculate amounts server-side for security
        let subtotal = 0;
        const validatedProducts = await Promise.all(products.map(async (item) => {
            const product = await Product.findOne({ _id: item.product, companyId });
            if (!product) {
                throw new Error(`Product not found or does not belong to this company: ${item.product}`);
            }
            
            const amount = item.quantity * product.unitPrice;
            subtotal += amount;

            return {
                product: product._id,
                quantity: item.quantity,
                unitPrice: product.unitPrice,
                amount: amount
            };
        }));

        const vatAmount = subtotal * 0.18; // 18% VAT
        const grandTotal = subtotal + vatAmount;

        if (manualInvoiceNo) {
            invoiceToUpdate.invoiceNo = manualInvoiceNo;
        }
        if (poNumber !== undefined) {
            invoiceToUpdate.poNumber = poNumber;
        }
        if (salesRep !== undefined) {
            invoiceToUpdate.salesRep = salesRep;
        }
        invoiceToUpdate.customer = customer;
        invoiceToUpdate.date = date || invoiceToUpdate.date;
        invoiceToUpdate.products = validatedProducts;
        invoiceToUpdate.subtotal = subtotal;
        invoiceToUpdate.vatAmount = vatAmount;
        invoiceToUpdate.grandTotal = grandTotal;

        const updatedInvoice = await invoiceToUpdate.save();
        res.status(200).json(updatedInvoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
};
