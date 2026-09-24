import React, { useState, useEffect } from 'react';
import { FileText, Save } from 'lucide-react';

const InvoiceSettings = ({ data = {}, onSave, saving }) => {
    const [formData, setFormData] = useState({
        prefix: '',
        defaultDueDays: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                prefix: data.prefix || 'INV-',
                defaultDueDays: data.defaultDueDays || 14
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
                <FileText size={22} className="text-blue" />
                <h2>Invoice Configuration</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="settings-form">
                <div className="settings-form-row">
                    <div className="form-group">
                        <label>Invoice Number Prefix</label>
                        <input
                            type="text"
                            name="prefix"
                            value={formData.prefix}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. INV-, GT-, INET-"
                        />
                        <small className="text-muted" style={{ display: 'block', marginTop: '0.25rem' }}>
                            Next invoice will look like: <strong>{formData.prefix || 'INV-'}0001</strong>
                        </small>
                    </div>
                    <div className="form-group">
                        <label>Default Payment Terms (Days)</label>
                        <input
                            type="number"
                            name="defaultDueDays"
                            value={formData.defaultDueDays}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. 14, 30"
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

export default InvoiceSettings;
