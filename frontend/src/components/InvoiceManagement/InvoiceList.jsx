import React, { useState, useEffect } from 'react';
import { getInvoices, deleteInvoice } from '../../services/api';
import CreateInvoice from './CreateInvoice';
import InvoicePrint from './InvoicePrint';
import { Plus, FileText, Printer, Trash2, Edit, Mail } from 'lucide-react';
import { getCompany, getInvoiceById } from '../../services/api';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editInvoice, setEditInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [printingInvoice, setPrintingInvoice] = useState(null);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await getInvoices();
            setInvoices(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
            try {
                await deleteInvoice(id);
                fetchInvoices();
            } catch (error) {
                console.error('Error deleting invoice:', error);
                alert('Failed to delete invoice.');
            }
        }
    };

    const handlePrintClick = async (invoiceId) => {
        try {
            // Fetch full invoice with populated products
            const invoiceRes = await getInvoiceById(invoiceId);
            let currentSettings = settings;
            
            // Fetch settings (active company details) if not already loaded
            if (!currentSettings) {
                const activeCompanyId = localStorage.getItem('activeCompanyId');
                if (activeCompanyId) {
                    const compRes = await getCompany(activeCompanyId);
                    currentSettings = {
                        companyName: compRes.data.name,
                        address: compRes.data.address,
                        tinNumber: compRes.data.tinNo,
                        telephone: compRes.data.telephoneNo
                    };
                    setSettings(currentSettings);
                }
            }
            
            setPrintingInvoice({
                invoice: invoiceRes.data,
                settings: currentSettings,
                autoEmail: false
            });
        } catch (error) {
            console.error('Error preparing print view:', error);
            alert('Failed to load invoice details for printing.');
        }
    };

    const handleEmailClick = async (invoiceId) => {
        try {
            // Fetch full invoice with populated products
            const invoiceRes = await getInvoiceById(invoiceId);
            let currentSettings = settings;
            
            // Fetch settings (active company details) if not already loaded
            if (!currentSettings) {
                const activeCompanyId = localStorage.getItem('activeCompanyId');
                if (activeCompanyId) {
                    const compRes = await getCompany(activeCompanyId);
                    currentSettings = {
                        companyName: compRes.data.name,
                        address: compRes.data.address,
                        tinNumber: compRes.data.tinNo,
                        telephone: compRes.data.telephoneNo
                    };
                    setSettings(currentSettings);
                }
            }
            
            setPrintingInvoice({
                invoice: invoiceRes.data,
                settings: currentSettings,
                autoEmail: true
            });
        } catch (error) {
            console.error('Error preparing email view:', error);
            alert('Failed to load invoice details for emailing.');
        }
    };

    const handleEditClick = async (invoiceId) => {
        try {
            const invoiceRes = await getInvoiceById(invoiceId);
            setEditInvoice(invoiceRes.data);
            setIsCreating(true);
        } catch (error) {
            console.error('Error fetching invoice for edit:', error);
            alert('Failed to load invoice details for editing.');
        }
    };

    return (
        <div className="invoice-management">
            <div className="header-section fade-in">
                <div>
                    <h1 className="title">Invoice Management</h1>
                    <p className="subtitle">Generate and manage tax invoices with 18% VAT.</p>
                </div>
                {!isCreating && (
                    <button className="btn btn-primary pulse-hover" onClick={() => { setIsCreating(true); setEditInvoice(null); }}>
                        <Plus size={20} /> Create New Invoice
                    </button>
                )}
            </div>

            {isCreating ? (
                <CreateInvoice 
                    setCreating={setIsCreating} 
                    fetchInvoices={fetchInvoices} 
                    invoiceToEdit={editInvoice} 
                />
            ) : (
                <div className="card glass list-container fade-in-up">
                    {loading ? (
                        <div className="loader">Loading invoices...</div>
                    ) : invoices.length === 0 ? (
                        <div className="empty-state">
                            <FileText size={48} className="empty-icon" />
                            <h3>No Invoices Found</h3>
                            <p>Generate your first invoice to get started.</p>
                            <button className="btn btn-outline" onClick={() => setIsCreating(true)}>
                                <Plus size={18} /> Create Invoice
                            </button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Invoice No</th>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>TIN No</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice) => (
                                        <tr key={invoice._id} className="table-row">
                                            <td>
                                                <div className="font-bold text-blue">{invoice.invoiceNo}</div>
                                            </td>
                                            <td>
                                                {new Date(invoice.date).toLocaleDateString('en-GB')}
                                            </td>
                                            <td>
                                                <div className="font-medium">{invoice.customer?.name}</div>
                                            </td>
                                            <td>
                                                {invoice.customer?.tinNo || '-'}
                                            </td>
                                            <td>
                                                <div className="font-bold">
                                                    LKR {new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2 }).format(invoice.grandTotal)}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${invoice.status === 'Paid' ? 'badge-alt' : 'text-yellow'}`}>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="btn-icon text-blue" 
                                                        title="Print Invoice"
                                                        onClick={() => handlePrintClick(invoice._id)}
                                                    >
                                                        <Printer size={18} />
                                                    </button>
                                                    <button 
                                                        className="btn-icon text-indigo" 
                                                        title="Email Invoice"
                                                        style={{ color: '#4f46e5' }}
                                                        onClick={() => handleEmailClick(invoice._id)}
                                                    >
                                                        <Mail size={18} />
                                                    </button>
                                                    <button 
                                                        className="btn-icon text-green" 
                                                        title="Edit Invoice"
                                                        onClick={() => handleEditClick(invoice._id)}
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button 
                                                        className="btn-icon text-red" 
                                                        title="Delete Invoice"
                                                        onClick={() => handleDelete(invoice._id)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {printingInvoice && (
                <InvoicePrint 
                    invoice={printingInvoice.invoice} 
                    settings={printingInvoice.settings} 
                    setPrinting={() => setPrintingInvoice(null)} 
                    autoEmail={printingInvoice.autoEmail}
                />
            )}
        </div>
    );
};

export default InvoiceList;
