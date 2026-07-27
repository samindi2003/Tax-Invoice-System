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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
