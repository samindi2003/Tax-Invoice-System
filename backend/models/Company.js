const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
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
    tinNo: {
        type: String,
        required: false,
    },
    logo: {
        type: String, // Base64 or URL
        required: false,
    },
    otherInfo: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Company', companySchema);
