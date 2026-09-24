const Settings = require('../models/Settings');
const { getCompanyId } = require('./invoiceController'); // Re-using the helper or redefine it

// Helper to get company ID (since we don't have a shared utils folder yet)
const getCompanyIdLocal = (req) => {
    return req.headers['company-id'];
};

// @desc    Get company settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        const companyId = getCompanyIdLocal(req);
        if (!companyId) return res.status(400).json({ message: 'Company ID is required in headers' });

        let settings = await Settings.findOne({ companyId });
        
        // Create default settings if they don't exist for this company
        if (!settings) {
            const Company = require('../models/Company');
            const companyData = await Company.findById(companyId);
            
            const initialCompanySettings = companyData ? {
                companyName: companyData.name || 'Company Name',
                tinNumber: companyData.tinNo || '',
                address: companyData.address || '',
                telephone: companyData.telephoneNo || '',
                logoUrl: companyData.logo || ''
            } : undefined;

            settings = await Settings.create({ 
                companyId,
                ...(initialCompanySettings && { company: initialCompanySettings })
            });
        }
        
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update company settings
// @route   PUT /api/settings
// @access  Public
const updateSettings = async (req, res) => {
    try {
        const companyId = getCompanyIdLocal(req);
        if (!companyId) return res.status(400).json({ message: 'Company ID is required in headers' });

        let settings = await Settings.findOne({ companyId });

        if (!settings) {
            settings = new Settings({ companyId });
        }

        // Deep merge categories
        const categories = [
            'company', 'invoice', 'taxVat', 'template', 
            'payment', 'email', 'terms', 'currency', 
            'account', 'notifications'
        ];

        categories.forEach(category => {
            if (req.body[category]) {
                if (!settings[category]) settings[category] = {};
                settings[category] = {
                    ...settings[category], 
                    ...req.body[category]
                };
            }
        });

        const updatedSettings = await settings.save();

        // Sync back to Company model if company settings were updated
        if (req.body.company) {
            const Company = require('../models/Company');
            await Company.findByIdAndUpdate(companyId, {
                name: updatedSettings.company.companyName,
                tinNo: updatedSettings.company.tinNumber,
                address: updatedSettings.company.address,
                telephoneNo: updatedSettings.company.telephone
            });
        }

        res.status(200).json(updatedSettings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
