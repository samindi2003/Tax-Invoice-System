import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../services/api';
import { Save, Building } from 'lucide-react';

const CompanyProfile = () => {
    const [formData, setFormData] = useState({
        companyName: 'I-Net-System & Solutions (Pvt) Ltd',
        tinNumber: '114314200-700',
        address: 'No.88/3A Ground Floor, Justice Akbar Mawatha, Colombo-02',
        telephone: '0777745489'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await getSettings();
            if (response.data && response.data.companyName) {
                setFormData({
                    companyName: response.data.companyName,
                    tinNumber: response.data.tinNumber || '114314200-700',
                    address: response.data.address || 'No.88/3A Ground Floor, Justice Akbar Mawatha, Colombo-02',
                    telephone: response.data.telephone || '0777745489'
                });
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching settings:', error);
            // Don't set error message, just keep the default permanent values if DB fails
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMessage('');
        
        try {
            await updateSettings(formData);
            setSuccessMessage('Company profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update company profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loader">Loading company profile...</div>;
    }

    return (
        <div className="settings-management fade-in">
            <div className="header-section">
                <div>
                    <h1 className="title">Settings</h1>
                    <p className="subtitle">Configure your company profile and invoice details.</p>
                </div>
            </div>

            <div className="card glass form-container" style={{ margin: '0', maxWidth: '600px' }}>
                <div className="card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building size={20} className="text-blue" />
                        <h2>Company Profile</h2>
                    </div>
                </div>
                
                {error && <div className="alert-error">{error}</div>}
                {successMessage && (
                    <div className="alert-success" style={{ 
                        background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', 
                        padding: '1rem', borderRadius: 'var(--radius-md)', margin: '1.5rem 2rem 0', 
                        border: '1px solid rgba(16, 185, 129, 0.2)' 
                    }}>
                        {successMessage}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="form">
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
                        <label>Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Enter full company address"
                            rows="3"
                        ></textarea>
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
                    
                    <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanyProfile;
