const mongoose = require('mongoose');

const salesRepSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SalesRep', salesRepSchema);
