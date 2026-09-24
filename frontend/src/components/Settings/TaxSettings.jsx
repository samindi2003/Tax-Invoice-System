import React, { useState, useEffect } from 'react';
import { Percent, Save } from 'lucide-react';

const TaxSettings = ({ data = {}, onSave, saving }) => {
    const [formData, setFormData] = useState({
        defaultRate: 0,
        taxNumber: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                defaultRate: data.defaultRate || 0,
                taxNumber: data.taxNumber || ''
            });
        }
    }, [data]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="settings-card">
            <div className="settings-card-header">
                <Percent size={22} className="text-blue" />
                <h2>Tax & VAT Configuration</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="settings-form">
                <div className="settings-form-row">
                    <div className="form-group">
                        <label>Default Tax/VAT Rate (%)</label>
                        <input
                            type="number"
                            name="defaultRate"
                            value={formData.defaultRate}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. 18"
                        />
                    </div>
                    <div className="form-group">
                        <label>VAT Registration Number</label>
                        <input
                            type="text"
                            name="taxNumber"
                            value={formData.taxNumber}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. VAT-123456"
                        />
                    </div>
                </div>

                <div className="settings-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaxSettings;
