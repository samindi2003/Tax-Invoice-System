import React, { useState, useEffect } from 'react';
import { DollarSign, Save } from 'lucide-react';

const CurrencySettings = ({ data = {}, onSave, saving }) => {
    const [formData, setFormData] = useState({
        code: '',
        symbol: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                code: data.code || 'LKR',
                symbol: data.symbol || 'Rs'
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
                <DollarSign size={22} className="text-blue" />
                <h2>Currency Configuration</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="settings-form">
                <div className="settings-form-row">
                    <div className="form-group">
                        <label>Currency Code</label>
                        <select
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="LKR">LKR (Sri Lankan Rupee)</option>
                            <option value="USD">USD (US Dollar)</option>
                            <option value="EUR">EUR (Euro)</option>
                            <option value="GBP">GBP (British Pound)</option>
                            <option value="AUD">AUD (Australian Dollar)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Currency Symbol</label>
                        <input
                            type="text"
                            name="symbol"
                            value={formData.symbol}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. Rs, $, €"
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

export default CurrencySettings;
