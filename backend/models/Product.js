const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    referenceNumber: {
        type: String,
        required: false,
    },
    poNumber: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        enum: ['Product', 'Service', 'Software'],
        required: true,
        default: 'Product'
    },
    taxRate: {
        type: Number,
        required: false,
        default: 0
    },
    salesRep: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
