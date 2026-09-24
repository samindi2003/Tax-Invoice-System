const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        unique: true
    },
    company: {
        companyName: { type: String, default: 'Company Name' },
        tinNumber: { type: String, default: '' },
        address: { type: String, default: '' },
        telephone: { type: String, default: '' },
        logoUrl: { type: String, default: '' }
    },
    invoice: {
        prefix: { type: String, default: 'INV-' },
        defaultDueDays: { type: Number, default: 14 }
    },
    taxVat: {
        defaultRate: { type: Number, default: 0 },
        taxNumber: { type: String, default: '' }
    },
    template: {
        colorPrimary: { type: String, default: '#3b82f6' },
        colorSecondary: { type: String, default: '#1e40af' },
        font: { type: String, default: 'Inter' }
    },
    payment: {
        bankDetails: { type: String, default: '' },
        instructions: { type: String, default: '' }
    },
    email: {
        smtpHost: { type: String, default: '' },
        smtpUser: { type: String, default: '' },
        smtpPass: { type: String, default: '' },
        defaultSubject: { type: String, default: 'Invoice from [Company]' },
        defaultBody: { type: String, default: 'Please find your invoice attached.' }
    },
    terms: {
        defaultTerms: { type: String, default: 'Thank you for your business.' }
    },
    currency: {
        code: { type: String, default: 'LKR' },
        symbol: { type: String, default: 'Rs' }
    },
    account: {
        adminName: { type: String, default: 'Admin' },
        adminEmail: { type: String, default: '' }
    },
    notifications: {
        emailOnCreate: { type: Boolean, default: true },
        emailOnDue: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
