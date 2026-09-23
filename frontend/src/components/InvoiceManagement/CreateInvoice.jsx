import React, { useState, useEffect } from 'react';
import { getCustomers, getProducts, getCompany, createInvoice, updateInvoice } from '../../services/api';
import { Save, X, Plus, Trash2 } from 'lucide-react';

const SearchableItemSelect = ({ items, value, onChange, disabled }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    
    const selectedItem = items.find(i => i._id === value);
    
    useEffect(() => {
        if (selectedItem && !isOpen) {
            setSearch(selectedItem.name);
        }
    }, [selectedItem, isOpen]);

    const filteredItems = items.filter(i => 
        i.name.toLowerCase().includes(search.toLowerCase()) || 
        (i.category && i.category.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div style={{ position: 'relative' }}>
            <input 
                type="text" 
                className={`input-field py-1 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder={disabled ? "Select category first..." : "Search item (e.g. web)..."}
                value={isOpen ? search : (selectedItem ? selectedItem.name : '')}
                disabled={disabled}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => {
                    setSearch('');
                    setIsOpen(true);
                }}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            />
            {isOpen && (
                <div style={{ 
                    position: 'absolute', zIndex: 50, width: '100%', backgroundColor: 'white', 
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                    maxHeight: '200px', overflowY: 'auto', borderRadius: '0.375rem', marginTop: '4px' 
                }}>
                    {filteredItems.map(item => (
                        <div 
                            key={item._id} 
                            style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', textAlign: 'left' }}
                            onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                            onClick={() => {
                                onChange(item._id);
                                setIsOpen(false);
                            }}
                            className="hover:bg-slate-50"
                        >
                            <div className="font-bold text-sm text-slate-800">
                                {item.name} 
                                <span className="text-xs ml-2 px-1 rounded bg-blue-100 text-blue-800" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>{item.category}</span>
                            </div>
                        </div>
                    ))}
                    {filteredItems.length === 0 && <div style={{ padding: '8px', fontSize: '0.875rem', color: '#64748b' }}>No items found</div>}
                </div>
            )}
        </div>
    );
};

const CreateInvoice = ({ setCreating, fetchInvoices, invoiceToEdit }) => {
    const [customers, setCustomers] = useState([]);
    const [productsList, setProductsList] = useState([]);
    const [settings, setSettings] = useState(null);

    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [invoiceItems, setInvoiceItems] = useState([{ category: '', product: '', quantity: 1, unitPrice: 0, amount: 0, taxRate: 0 }]);
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
                    category: prod ? prod.category : '',
                    product: prodId,
                    quantity: item.quantity,
                    unitPrice: uPrice,
                    amount: item.quantity * uPrice,
                    taxRate: prod ? prod.taxRate : 0
                };
            });
            setInvoiceItems(mappedItems.length > 0 ? mappedItems : [{ category: '', product: '', quantity: 1, unitPrice: 0, amount: 0, taxRate: 0 }]);
        }
    }, [invoiceToEdit, productsList]);

    const fetchInitialData = async () => {
        try {
            const activeCompanyId = localStorage.getItem('activeCompanyId');
            if (!activeCompanyId) throw new Error('No active company selected');

            const [custRes, prodRes, compRes] = await Promise.all([
                getCustomers(),
                getProducts(),
                getCompany(activeCompanyId)
            ]);
            setCustomers(custRes.data);
            setProductsList(prodRes.data);
            setSettings({
                companyName: compRes.data.name,
                address: compRes.data.address,
                tinNumber: compRes.data.tinNo,
                telephone: compRes.data.telephoneNo
            });
        } catch (error) {
            console.error('Error fetching initial data:', error);
            setError('Failed to load customers or products. Ensure the database is connected.');
        }
    };

    const handleAddItem = () => {
        setInvoiceItems([...invoiceItems, { category: '', product: '', quantity: 1, unitPrice: 0, amount: 0, taxRate: 0 }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = invoiceItems.filter((_, i) => i !== index);
        setInvoiceItems(newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...invoiceItems];
        newItems[index][field] = value;

        if (field === 'category') {
            // Reset product selection if category changes
            newItems[index].product = '';
            newItems[index].unitPrice = 0;
            newItems[index].amount = 0;
            newItems[index].taxRate = 0;
        }

        if (field === 'product') {
            const selectedProd = productsList.find(p => p._id === value);
            if (selectedProd) {
                newItems[index].unitPrice = selectedProd.unitPrice || 0;
                newItems[index].taxRate = selectedProd.taxRate || 0;
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
    // Modified VAT Calculation: Uses item specific tax rate if available, else fallback to 18% if no items have tax, wait, 
    // Usually it's standard 18% on total OR sum of item taxes. For simplicity, let's just sum individual item taxes.
    const vatAmount = invoiceItems.reduce((sum, item) => sum + (item.amount * (item.taxRate / 100 || 0)), 0) || (subtotal * 0.18);
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
                                <th width="40%">Item / Search</th>
                                <th width="15%">Quantity</th>
                                <th width="20%">Unit Price (LKR)</th>
                                <th width="20%">Amount (LKR)</th>
                                <th width="5%"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoiceItems.map((item, index) => {
                                const selectedProd = productsList.find(p => p._id === item.product);
                                return (
                                <tr key={index} style={{ verticalAlign: 'top' }}>
                                    <td>
                                        <select
                                            className="input-field py-1 mb-2"
                                            value={item.category || ''}
                                            onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                                        >
                                            <option value="">1. Select Category...</option>
                                            <option value="Product">Product</option>
                                            <option value="Service">Professional Service</option>
                                            <option value="Software">Software</option>
                                        </select>
                                        <SearchableItemSelect 
                                            items={item.category ? productsList.filter(p => p.category === item.category) : []} 
                                            value={item.product} 
                                            onChange={(val) => handleItemChange(index, 'product', val)}
                                            disabled={!item.category}
                                        />
                                        {selectedProd && (
                                            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '4px', fontSize: '0.8rem', color: '#475569', textAlign: 'left' }}>
                                                <div style={{ marginBottom: '4px' }}><strong>Category:</strong> {selectedProd.category}</div>
                                                <div style={{ marginBottom: '4px' }}><strong>Desc:</strong> {selectedProd.description}</div>
                                                <div><strong>VAT/Tax:</strong> {selectedProd.taxRate > 0 ? `${selectedProd.taxRate}%` : 'None'}</div>
                                            </div>
                                        )}
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
                                            className="input-field py-1 text-right"
                                            value={item.unitPrice}
                                            onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                        />
                                    </td>
                                    <td className="text-right font-medium" style={{ paddingTop: '10px' }}>
                                        {formatCurrency(item.amount)}
                                    </td>
                                    <td style={{ paddingTop: '8px' }}>
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
                            )})}
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
