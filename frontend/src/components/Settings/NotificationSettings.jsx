import React, { useState, useEffect } from 'react';
import { Bell, Save } from 'lucide-react';

const NotificationSettings = ({ data = {}, onSave, saving }) => {
    const [formData, setFormData] = useState({
        emailOnCreate: true,
        emailOnDue: false
    });

    useEffect(() => {
        if (data) {
            setFormData({
                emailOnCreate: data.emailOnCreate ?? true,
                emailOnDue: data.emailOnDue ?? false
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="settings-card">
            <div className="settings-card-header">
                <Bell size={22} className="text-blue" />
                <h2>Notification Preferences</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="settings-form">
                
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            name="emailOnCreate"
                            checked={formData.emailOnCreate}
                            onChange={handleChange}
                        />
                        <span>Send email to customer automatically when a new invoice is created</span>
                    </label>
                    
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            name="emailOnDue"
                            checked={formData.emailOnDue}
                            onChange={handleChange}
                        />
                        <span>Send automated reminder email 3 days before invoice due date</span>
                    </label>
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

export default NotificationSettings;
