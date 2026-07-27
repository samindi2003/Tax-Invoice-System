import React, { useState, useEffect } from 'react';
import { getCustomers, getProducts, getSettings, createInvoice, updateInvoice } from '../../services/api';
import { Save, X, Plus, Trash2 } from 'lucide-react';

const CreateInvoice = ({ setCreating, fetchInvoices, invoiceToEdit }) => {
    const [customers, setCustomers] = useState([]);
    const [productsList, setProductsList] = useState([]);
    const [settings, setSettings] = useState(null);

    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [invoiceItems, setInvoiceItems] = useState([{ product: '', quantity: 1, unitPrice: 0, amount: 0 }]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [poNumber, setPoNumber] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (invoiceToEdit && productsList.length > 0) {
            setSelectedCustomer(invoiceToEdit.customer?._id || invoiceToEdit.customer || '');
            setInvoiceNo(invoiceToEdit.invoiceNo || '');
            setPoNumber(invoiceToEdit.poNumber || '');
            if (invoiceToEdit.date) {
                setDate(new Date(invoiceToEdit.date).toISOString().split('T')[0]);
            }
            
            const mappedItems = invoiceToEdit.products.map(item => {
                const prodId = item.product?._id || item.product;
                const prod = productsList.find(p => p._id === prodId);
                const uPrice = prod ? prod.unitPrice : 0;
                return {
                    product: prodId,
                    quantity: item.quantity,
                    unitPrice: uPrice,
                    amount: item.quantity * uPrice
                };
            });
            setInvoiceItems(mappedItems.length > 0 ? mappedItems : [{ product: '', quantity: 1, unitPrice: 0, amount: 0 }]);
        }
    }, [invoiceToEdit, productsList]);

    const fetchInitialData = async () => {
        try {
            const [custRes, prodRes, setRes] = await Promise.all([
                getCustomers(),
                getProducts(),
                getSettings()
            ]);
            setCustomers(custRes.data);
            setProductsList(prodRes.data);
            setSettings(setRes.data);
        } catch (error) {
            console.error('Error fetching initial data:', error);
            setError('Failed to load customers or products. Ensure the database is connected.');
        }
    };

    const handleAddItem = () => {
        setInvoiceItems([...invoiceItems, { product: '', quantity: 1, unitPrice: 0, amount: 0 }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = invoiceItems.filter((_, i) => i !== index);
        setInvoiceItems(newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...invoiceItems];
        newItems[index][field] = value;

        if (field === 'product') {
            const selectedProd = productsList.find(p => p._id === value);
            if (selectedProd) {
                newItems[index].unitPrice = selectedProd.unitPrice || 0;
                newItems[index].amount = newItems[index].quantity * (selectedProd.unitPrice || 0);
            }
        }

        if (field === 'quantity' || field === 'unitPrice') {
            newItems[index].amount = newItems[index].quantity * newItems[index].unitPrice;
        }

        setInvoiceItems(newItems);
    };

    // Calculations
    const subtotal = invoiceItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const vatAmount = subtotal * 0.18;
    const grandTotal = subtotal + vatAmount;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCustomer) return setError('Please select a customer');
        if (invoiceItems.some(i => !i.product)) return setError('Please select a product for all rows');

        try {
            const payload = {
                customer: selectedCustomer,
                date: new Date(date).toISOString(),
                invoiceNo: invoiceNo.trim() || undefined,
                poNumber: poNumber.trim() || undefined,
                products: invoiceItems.map(item => ({
                    product: item.product,
                    quantity: Number(item.quantity)
                }))
            };
            
            if (invoiceToEdit) {
                await updateInvoice(invoiceToEdit._id, payload);
            } else {
                await createInvoice(payload);
            }
            fetchInvoices();
            setCreating(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create invoice');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2 }).format(amount);
    };

    return (
        <div className="card glass form-container slide-in invoice-form">
            <div className="card-header">
                <h2>{invoiceToEdit ? 'Edit Invoice' : 'Create Invoice'}</h2>
                <button className="btn-icon" onClick={() => setCreating(false)}>
                    <X size={20} />
                </button>
            </div>
            
            {error && <div className="alert-error">{error}</div>}
            
            <form onSubmit={handleSubmit} className="form p-6">
                
                {/* Header Section */}
                <div className="invoice-header-row mb-8 flex justify-between">
                    <div>
                        <h3 className="font-bold text-xl text-blue mb-2">TAX INVOICE</h3>
                        <div className="mt-2 mb-2 flex items-center">
                            <label className="text-sm mr-2">Invoice No:</label>
                            <input 
                                type="text"
                                className="input-field inline-block w-auto py-1"
                                placeholder="[Auto-Generated]"
                                value={invoiceNo}
                                onChange={(e) => setInvoiceNo(e.target.value)}
                            />
                        </div>
                        <div className="mt-2 mb-2 flex items-center">
                            <label className="text-sm mr-2">P.O. No:</label>
                            <input 
                                type="text"
                                className="input-field inline-block w-auto py-1"
                                placeholder="Optional"
                                value={poNumber}
                                onChange={(e) => setPoNumber(e.target.value)}
                            />
                        </div>
                        <div className="mt-2">
                            <label className="text-sm">Invoice Date: </label>
                            <input 
                                type="date" 
                                className="input-field inline-block w-auto py-1"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="text-right">
                        <h4 className="font-bold text-lg mb-1">{settings?.companyName || 'Your Company Name'}</h4>
                        <p className="text-sm text-muted">{settings?.address || 'Company Address'}</p>
                        <p className="text-sm text-muted">TIN: {settings?.tinNumber || 'N/A'}</p>
                        <p className="text-sm text-muted">Tel: {settings?.telephone || 'N/A'}</p>
                    </div>
                </div>

                <div className="divider mb-6"></div>

                {/* Purchaser Section */}
                <div className="form-group mb-8 w-1/2">
                    <label className="text-blue font-bold mb-2 block">Purchaser Details</label>
                    <select 
                        className="input-field" 
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                        required
                    >
                        <option value="">Select Customer ▼</option>
                        {customers.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Products Table */}
                <div className="invoice-items mb-8">
                    <table className="modern-table mb-4">
                        <thead>
                            <tr>
                                <th>Product / Description</th>
                                <th width="15%">Quantity</th>
                                <th width="20%">Unit Price (LKR)</th>
                                <th width="20%">Amount (LKR)</th>
                                <th width="5%"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoiceItems.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <select 
                                            className="input-field py-1"
                                            value={item.product}
                                            onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                                            required
                                        >
                                            <option value="">Select Product...</option>
                                            {productsList.map(p => (
                                                <option key={p._id} value={p._id}>{p.name} - {p.referenceNo}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            className="input-field py-1 text-center"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td className="text-right">
                                        <input 
                                            type="number"
                                            className="input-field py-1 text-right bg-transparent border-none"
                                            value={item.unitPrice}
                                            readOnly
                                        />
                                    </td>
                                    <td className="text-right font-medium">
                                        {formatCurrency(item.amount)}
                                    </td>
                                    <td>
                                        {invoiceItems.length > 1 && (
                                            <button 
                                                type="button" 
                                                className="btn-icon text-red"
                                                onClick={() => handleRemoveItem(index)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="button" className="btn btn-outline btn-sm" onClick={handleAddItem}>
                        <Plus size={16} /> Add Another Product
                    </button>
                </div>

                <div className="divider mb-6"></div>

                {/* Totals Section */}
                <div className="totals-section flex justify-end mb-8">
                    <div className="w-1/3">
                        <div className="flex justify-between mb-2">
                            <span className="text-muted">Subtotal:</span>
                            <span className="font-medium">LKR {formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-muted">VAT (18%):</span>
                            <span className="font-medium">LKR {formatCurrency(vatAmount)}</span>
                        </div>
                        <div className="divider my-2"></div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="font-bold text-lg text-blue">Grand Total:</span>
                            <span className="font-bold text-xl">LKR {formatCurrency(grandTotal)}</span>
                        </div>
                        <div className="divider my-2 double"></div>
                    </div>
                </div>
                
                <div className="form-actions mt-4">
                    <button type="button" className="btn btn-secondary" onClick={() => setCreating(false)}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary pulse-hover">
                        <Save size={18} /> {invoiceToEdit ? 'Update Invoice' : 'Save Invoice'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateInvoice;
