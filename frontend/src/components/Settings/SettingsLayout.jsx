import React, { useState, useEffect } from 'react';
import { 
    Building, 
    FileText, 
    Percent, 
    LayoutTemplate, 
    CreditCard, 
    Mail, 
    ClipboardList, 
    DollarSign, 
    User, 
    Bell,
    Save
} from 'lucide-react';
import { getSettings, updateSettings } from '../../services/api';
import './Settings.css';

// Import subcomponents
import CompanyProfile from './CompanyProfile';
import InvoiceSettings from './InvoiceSettings';
import TaxSettings from './TaxSettings';
import TemplateSettings from './TemplateSettings';
import PaymentSettings from './PaymentSettings';
import EmailSettings from './EmailSettings';
import TermsSettings from './TermsSettings';
import CurrencySettings from './CurrencySettings';
import AccountSettings from './AccountSettings';
import NotificationSettings from './NotificationSettings';

const SettingsLayout = () => {
    const [activeTab, setActiveTab] = useState('company');
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await getSettings();
            setSettings(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setLoading(false);
        }
    };

    const handleSave = async (category, data) => {
        setSaving(true);
        setMessage('');
        try {
            const payload = { [category]: data };
            const response = await updateSettings(payload);
            setSettings(response.data);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'company', label: 'Company', icon: <Building size={18} /> },
        { id: 'invoice', label: 'Invoice', icon: <FileText size={18} /> },
        { id: 'taxVat', label: 'Tax & VAT', icon: <Percent size={18} /> },
        { id: 'template', label: 'Invoice Template', icon: <LayoutTemplate size={18} /> },
        { id: 'payment', label: 'Payment', icon: <CreditCard size={18} /> },
        { id: 'email', label: 'Email', icon: <Mail size={18} /> },
        { id: 'terms', label: 'Terms & Conditions', icon: <ClipboardList size={18} /> },
        { id: 'currency', label: 'Currency', icon: <DollarSign size={18} /> },
        { id: 'account', label: 'Account & Users', icon: <User size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    ];

    const renderContent = () => {
        if (loading) return <div className="loader">Loading settings...</div>;
        if (!settings) return <div>Failed to load settings. Please try again.</div>;

        switch (activeTab) {
            case 'company': return <CompanyProfile data={settings.company} onSave={(data) => handleSave('company', data)} saving={saving} />;
            case 'invoice': return <InvoiceSettings data={settings.invoice} onSave={(data) => handleSave('invoice', data)} saving={saving} />;
            case 'taxVat': return <TaxSettings data={settings.taxVat} onSave={(data) => handleSave('taxVat', data)} saving={saving} />;
            case 'template': return <TemplateSettings data={settings.template} onSave={(data) => handleSave('template', data)} saving={saving} />;
            case 'payment': return <PaymentSettings data={settings.payment} onSave={(data) => handleSave('payment', data)} saving={saving} />;
            case 'email': return <EmailSettings data={settings.email} onSave={(data) => handleSave('email', data)} saving={saving} />;
            case 'terms': return <TermsSettings data={settings.terms} onSave={(data) => handleSave('terms', data)} saving={saving} />;
            case 'currency': return <CurrencySettings data={settings.currency} onSave={(data) => handleSave('currency', data)} saving={saving} />;
            case 'account': return <AccountSettings data={settings.account} onSave={(data) => handleSave('account', data)} saving={saving} />;
            case 'notifications': return <NotificationSettings data={settings.notifications} onSave={(data) => handleSave('notifications', data)} saving={saving} />;
            default: return <CompanyProfile data={settings.company} onSave={(data) => handleSave('company', data)} saving={saving} />;
        }
    };

    return (
        <div className="settings-dashboard fade-in">
            <div className="header-section">
                <div>
                    <h1 className="title">Settings Dashboard</h1>
                    <p className="subtitle">Manage all your company and system configurations here.</p>
                </div>
            </div>

            {message && (
                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1rem' }}>
                    {message}
                </div>
            )}

            <div className="settings-layout">
                {/* Left Sidebar */}
                <aside className="settings-sidebar glass">
                    <nav className="settings-nav">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="icon">{tab.icon}</span>
                                <span className="label">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Right Content Area */}
                <main className="settings-content-area">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default SettingsLayout;
