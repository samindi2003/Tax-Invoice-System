import React, { useState, useEffect } from 'react';
import { CreditCard, Save } from 'lucide-react';

const PaymentSettings = ({ data = {}, onSave, saving }) => {
    const [formData, setFormData] = useState({
        bankDetails: '',
        instructions: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                bankDetails: data.bankDetails || '',
                instructions: data.instructions || ''
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
                <CreditCard size={22} className="text-blue" />
                <h2>Payment & Bank Details</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                    <label>Bank Account Details</label>
                    <textarea
                        name="bankDetails"
                        value={formData.bankDetails}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. Bank Name: HNB, Acc No: 123456789, Branch: Colombo"
                        rows="4"
                    ></textarea>
                    <small className="text-muted">This will be printed on your invoices so customers know where to pay.</small>
                </div>
                
                <div className="form-group">
                    <label>Additional Payment Instructions</label>
                    <textarea
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. Please send payment slip to accounts@company.com"
                        rows="3"
                    ></textarea>
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

export default PaymentSettings;
