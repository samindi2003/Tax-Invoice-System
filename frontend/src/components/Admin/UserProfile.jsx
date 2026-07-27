import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../../services/api';
import { User, Mail, Phone, Shield } from 'lucide-react';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile();
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading profile...</div>;
    if (!profile) return <div style={{ padding: '2rem' }} className="alert-error">Failed to load profile.</div>;

    return (
        <div className="fade-in">
            <div className="header-section">
                <div>
                    <h1 className="title">User Profile</h1>
                    <p className="subtitle">Manage your account details and role.</p>
                </div>
            </div>

            <div className="card glass form-container" style={{ margin: '0', maxWidth: '600px' }}>
                <div className="card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={20} className="text-primary" />
                        <h2>Profile Information</h2>
                    </div>
                </div>
                
                <div style={{ padding: '1.5rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                            {profile.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem' }}>{profile.name}</h3>
                            <span className="badge" style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem' }}>
                                <Shield size={14} />
                                {profile.role}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <p className="text-muted text-sm" style={{ marginBottom: '0.5rem' }}>Full Name</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.02)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                <User size={18} className="text-muted" />
                                <span className="font-medium">{profile.name}</span>
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-muted text-sm" style={{ marginBottom: '0.5rem' }}>Email Address</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.02)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                <Mail size={18} className="text-muted" />
                                <span className="font-medium">{profile.email}</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-muted text-sm" style={{ marginBottom: '0.5rem' }}>Phone Number</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.02)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                <Phone size={18} className="text-muted" />
                                <span className="font-medium">{profile.phone || 'Not provided'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
