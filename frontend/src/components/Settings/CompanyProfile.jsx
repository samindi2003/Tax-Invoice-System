import React, { useState, useEffect } from 'react';
import { Building, Save } from 'lucide-react';

const CompanyProfile = ({ data = {}, onSave, saving }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        tinNumber: '',
        address: '',
        telephone: '',
        logoUrl: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                companyName: data.companyName || '',
                tinNumber: data.tinNumber || '',
                address: data.address || '',
                telephone: data.telephone || '',
                logoUrl: data.logoUrl || ''
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
                <Building size={22} className="text-blue" />
                <h2>Company Profile</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                    <label>Company Name *</label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="e.g. Pure Tech Solutions (Pvt) Ltd"
                    />
                </div>
                
                <div className="settings-form-row">
                    <div className="form-group">
                        <label>TIN Number</label>
                        <input
                            type="text"
                            name="tinNumber"
                            value={formData.tinNumber}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. 102218191"
                        />
                    </div>
                    <div className="form-group">
                        <label>Telephone</label>
                        <input
                            type="text"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. 0112-514747 / 0777-133001"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Company Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter full company address"
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

export default CompanyProfile;
