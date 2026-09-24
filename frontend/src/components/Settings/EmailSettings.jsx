import React, { useState, useEffect } from 'react';
import { Mail, Save } from 'lucide-react';

const EmailSettings = ({ data = {}, onSave, saving }) => {
    const [formData, setFormData] = useState({
        smtpHost: '',
        smtpUser: '',
        smtpPass: '',
        defaultSubject: '',
        defaultBody: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                smtpHost: data.smtpHost || '',
                smtpUser: data.smtpUser || '',
                smtpPass: data.smtpPass || '',
                defaultSubject: data.defaultSubject || 'Invoice from [Company]',
                defaultBody: data.defaultBody || 'Please find your invoice attached.'
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
                <Mail size={22} className="text-blue" />
                <h2>Email & SMTP Configuration</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                    <label>SMTP Host / Provider</label>
                    <input
                        type="text"
                        name="smtpHost"
                        value={formData.smtpHost}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. smtp.gmail.com"
                    />
                </div>
                
                <div className="settings-form-row">
                    <div className="form-group">
                        <label>Email Address (SMTP User)</label>
                        <input
                            type="email"
                            name="smtpUser"
                            value={formData.smtpUser}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. billing@company.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>App Password (SMTP Pass)</label>
                        <input
                            type="password"
                            name="smtpPass"
                            value={formData.smtpPass}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="••••••••••••"
                        />
                    </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

                <div className="form-group">
                    <label>Default Email Subject</label>
                    <input
                        type="text"
                        name="defaultSubject"
                        value={formData.defaultSubject}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>
                
                <div className="form-group">
                    <label>Default Email Body</label>
                    <textarea
                        name="defaultBody"
                        value={formData.defaultBody}
                        onChange={handleChange}
                        className="input-field"
                        rows="4"
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

export default EmailSettings;
