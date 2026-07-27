import React, { useState } from 'react';
import { updatePassword } from '../../services/api';
import { Key, Lock, Eye, EyeOff } from 'lucide-react';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleShow = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (formData.newPassword !== formData.confirmPassword) {
            return setStatus({ type: 'error', message: 'New passwords do not match' });
        }

        if (formData.newPassword.length < 6) {
            return setStatus({ type: 'error', message: 'Password must be at least 6 characters' });
        }

        setLoading(true);

        try {
            await updatePassword({ 
                currentPassword: formData.currentPassword, 
                newPassword: formData.newPassword 
            });
            
            setStatus({ type: 'success', message: 'Password updated successfully!' });
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error.response?.data?.message || 'Failed to update password' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="header-section">
                <div>
                    <h1 className="title">Security Settings</h1>
                    <p className="subtitle">Update your password to keep your account secure.</p>
                </div>
            </div>

            <div className="card glass form-container" style={{ margin: '0', maxWidth: '500px' }}>
                <div className="card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Key size={20} className="text-primary" />
                        <h2>Change Password</h2>
                    </div>
                </div>
                
                {status.message && (
                    <div className={status.type === 'error' ? 'alert-error' : 'alert-success'} style={{ 
                        margin: '1.5rem 2rem 0', 
                        padding: '1rem', 
                        borderRadius: 'var(--radius-md)',
                        background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : undefined,
                        color: status.type === 'success' ? 'var(--secondary)' : undefined,
                        border: status.type === 'success' ? '1px solid rgba(16, 185, 129, 0.2)' : undefined
                    }}>
                        {status.message}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label>Current Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input
                                type={showPassword.current ? "text" : "password"}
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                required
                                className="input-field"
                                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                placeholder="Enter current password"
                            />
                            <button 
                                type="button"
                                onClick={() => toggleShow('current')}
                                style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                            >
                                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>New Password</label>
                        <div style={{ position: 'relative' }}>
                            <Key size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input
                                type={showPassword.new ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                className="input-field"
                                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                placeholder="Enter new password"
                            />
                            <button 
                                type="button"
                                onClick={() => toggleShow('new')}
                                style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                            >
                                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <div style={{ position: 'relative' }}>
                            <Key size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input
                                type={showPassword.confirm ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="input-field"
                                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                placeholder="Confirm new password"
                            />
                            <button 
                                type="button"
                                onClick={() => toggleShow('confirm')}
                                style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                            >
                                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
