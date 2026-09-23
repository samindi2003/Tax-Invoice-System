const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    tinNo: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    telephoneNo: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
