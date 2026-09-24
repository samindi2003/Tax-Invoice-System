import React, { useState, useEffect } from 'react';
import { User, Save } from 'lucide-react';

const AccountSettings = ({ data = {}, onSave, saving }) => {
    const [formData, setFormData] = useState({
        adminName: '',
        adminEmail: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                adminName: data.adminName || 'Admin',
                adminEmail: data.adminEmail || ''
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
                <User size={22} className="text-blue" />
                <h2>Account & Users</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="settings-form">
                <div className="settings-form-row">
                    <div className="form-group">
                        <label>Admin Name</label>
                        <input
                            type="text"
                            name="adminName"
                            value={formData.adminName}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className="form-group">
                        <label>Admin Email</label>
                        <input
                            type="email"
                            name="adminEmail"
                            value={formData.adminEmail}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. admin@company.com"
                        />
                    </div>
                </div>

                <div className="form-group" style={{ marginTop: '1rem', padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <strong>Note:</strong> Multi-user role management (Cashier, Manager, Admin) is not yet enabled for this company.
                    </p>
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

export default AccountSettings;
