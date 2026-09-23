import React, { useState } from 'react';
import { createProduct, updateProduct } from '../../services/api';
import { Save, X } from 'lucide-react';

const ProductForm = ({ currentProduct, setEditing, fetchProducts }) => {
    const [formData, setFormData] = useState({
        name: currentProduct ? currentProduct.name : '',
        referenceNumber: currentProduct ? currentProduct.referenceNumber || '' : '',
        poNumber: currentProduct ? currentProduct.poNumber || '' : '',
        description: currentProduct ? currentProduct.description : '',
        unitPrice: currentProduct ? currentProduct.unitPrice : '',
        quantity: currentProduct ? currentProduct.quantity || 0 : 0,
        category: currentProduct ? currentProduct.category || 'Product' : 'Product',
        taxRate: currentProduct ? currentProduct.taxRate || 0 : 0,
        salesRep: currentProduct ? currentProduct.salesRep || '' : '',
        status: currentProduct ? currentProduct.status || 'Active' : 'Active'
    });

    const [error, setError] = useState('');
    const [isNewSalesRep, setIsNewSalesRep] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentProduct) {
                await updateProduct(currentProduct._id, formData);
            } else {
                await createProduct(formData);
            }
            fetchProducts();
            setEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="card glass form-container slide-in">
            <div className="card-header">
                <h2>{currentProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="btn-icon" onClick={() => setEditing(false)}>
                    <X size={20} />
                </button>
            </div>
            
            {error && <div className="alert-error">{error}</div>}
            
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>Category *</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="input-field"
                    >
                        <option value="Product">Product</option>
                        <option value="Service">Service</option>
                        <option value="Software">Software</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Item / Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="e.g. Laptop, Web Development..."
                    />
                </div>

                <div className="form-group">
                    <label>Reference Number / SKU</label>
                    <input
                        type="text"
                        name="referenceNumber"
                        value={formData.referenceNumber}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. SKU-1002"
                    />
                </div>

                <div className="form-group">
                    <label>P.O. Number</label>
                    <input
                        type="text"
                        name="poNumber"
                        value={formData.poNumber}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. PO-2023-001"
                    />
                </div>
                
                <div className="form-group">
                    <label>Sales Representative</label>
                    {!isNewSalesRep ? (
                        <select
                            name="salesRep"
                            value={formData.salesRep}
                            onChange={(e) => {
                                if (e.target.value === 'new') {
                                    setIsNewSalesRep(true);
                                    setFormData({...formData, salesRep: ''});
                                } else {
                                    handleChange(e);
                                }
                            }}
                            className="input-field"
                        >
                            <option value="">Select Sales Representative ▼</option>
                            <option value="Kasun Perera">Kasun Perera</option>
                            <option value="Nimal Fernando">Nimal Fernando</option>
                            <option value="Amal Silva">Amal Silva</option>
                            <option value="new">+ New Sales Representative</option>
                        </select>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="salesRep"
                                value={formData.salesRep}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter New Sales Representative Name"
                                autoFocus
                            />
                            <button 
                                type="button" 
                                className="btn btn-secondary btn-sm"
                                onClick={() => setIsNewSalesRep(false)}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="form-group">
                    <label>Description of Good or Service *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="e.g. ASTA 85A/78A/36A UNIVERSAL TONER"
                        rows="3"
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <label>Unit Price (LKR) *</label>
                    <input
                        type="number"
                        step="0.01"
                        name="unitPrice"
                        value={formData.unitPrice}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="e.g. 1450.00"
                    />
                </div>
                
                <div className="form-group">
                    <label>Stock Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. 100"
                    />
                </div>

                <div className="form-group">
                    <label>Tax/VAT (%)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="taxRate"
                        value={formData.taxRate}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. 18"
                    />
                </div>

                <div className="form-group">
                    <label>Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        <Save size={18} /> {currentProduct ? 'Update Product' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
