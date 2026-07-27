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
        quantity: currentProduct ? currentProduct.quantity || 0 : 0
    });

    const [error, setError] = useState('');

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
                    <label>Product Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="e.g. ASTA Toner"
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
