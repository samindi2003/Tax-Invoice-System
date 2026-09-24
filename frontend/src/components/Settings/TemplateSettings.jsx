import React, { useState, useEffect } from 'react';
import { LayoutTemplate, Save } from 'lucide-react';

const TemplateSettings = ({ data = {}, onSave, saving }) => {
    const [formData, setFormData] = useState({
        colorPrimary: '',
        colorSecondary: '',
        font: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                colorPrimary: data.colorPrimary || '#3b82f6',
                colorSecondary: data.colorSecondary || '#1e40af',
                font: data.font || 'Inter'
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
                <LayoutTemplate size={22} className="text-blue" />
                <h2>Invoice Template Customization</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="settings-form">
                <div className="settings-form-row">
                    <div className="form-group">
                        <label>Primary Theme Color</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="color"
                                name="colorPrimary"
                                value={formData.colorPrimary}
                                onChange={handleChange}
                                style={{ width: '50px', height: '40px', padding: '0', cursor: 'pointer' }}
                            />
                            <input
                                type="text"
                                name="colorPrimary"
                                value={formData.colorPrimary}
                                onChange={handleChange}
                                className="input-field"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Secondary Theme Color</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="color"
                                name="colorSecondary"
                                value={formData.colorSecondary}
                                onChange={handleChange}
                                style={{ width: '50px', height: '40px', padding: '0', cursor: 'pointer' }}
                            />
                            <input
                                type="text"
                                name="colorSecondary"
                                value={formData.colorSecondary}
                                onChange={handleChange}
                                className="input-field"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Invoice Font Family</label>
                    <select
                        name="font"
                        value={formData.font}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="Inter">Inter (Modern Sans-serif)</option>
                        <option value="Roboto">Roboto (Clean Sans-serif)</option>
                        <option value="Times New Roman">Times New Roman (Classic Serif)</option>
                        <option value="Courier New">Courier New (Monospace)</option>
                    </select>
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

export default TemplateSettings;
