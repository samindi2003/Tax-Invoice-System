const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNo: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    poNumber: {
        type: String,
        required: false,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        unitPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        }
    }],
    subtotal: {
        type: Number,
        required: true,
        min: 0,
    },
    vatAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    grandTotal: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['Paid', 'Pending', 'Overdue'],
        default: 'Pending',
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
