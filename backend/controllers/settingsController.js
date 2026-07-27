const Settings = require('../models/Settings');

// @desc    Get company settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        
        // Create default settings if they don't exist
        if (!settings) {
            settings = await Settings.create({
                companyName: 'I-Net-System & Solutions (Pvt) Ltd',
                tinNumber: '114314200-700',
                address: 'No.88/3A Ground Floor, Justice Akbar Mawatha, Colombo-02',
                telephone: '0777745489'
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
        let settings = await Settings.findOne();

        if (settings) {
            settings.companyName = req.body.companyName !== undefined ? req.body.companyName : settings.companyName;
            settings.tinNumber = req.body.tinNumber !== undefined ? req.body.tinNumber : settings.tinNumber;
            settings.address = req.body.address !== undefined ? req.body.address : settings.address;
            settings.telephone = req.body.telephone !== undefined ? req.body.telephone : settings.telephone;

            const updatedSettings = await settings.save();
            res.status(200).json(updatedSettings);
        } else {
            // Should theoretically never happen because get creates it, but just in case
            const newSettings = await Settings.create(req.body);
            res.status(201).json(newSettings);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
