import React, { useState, useEffect } from 'react';
import { ClipboardList, Save } from 'lucide-react';

const TermsSettings = ({ data = {}, onSave, saving }) => {
    const [formData, setFormData] = useState({
        defaultTerms: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                defaultTerms: data.defaultTerms || 'Thank you for your business.'
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
                <ClipboardList size={22} className="text-blue" />
                <h2>Terms & Conditions</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                    <label>Default Invoice Terms & Conditions</label>
                    <textarea
                        name="defaultTerms"
                        value={formData.defaultTerms}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. 1. Goods once sold will not be taken back. 2. Payments must be made within 14 days."
                        rows="6"
                    ></textarea>
                    <small className="text-muted">This text will appear at the bottom of every new invoice you create.</small>
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

export default TermsSettings;
