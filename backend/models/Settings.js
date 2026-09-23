const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        default: 'Company Name'
    },
    tinNumber: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    telephone: {
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

module.exports = mongoose.model('Settings', settingsSchema);
