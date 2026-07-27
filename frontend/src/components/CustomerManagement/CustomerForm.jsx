import React, { useState } from 'react';
import { createCustomer, updateCustomer } from '../../services/api';
import { Save, X } from 'lucide-react';

const CustomerForm = ({ currentCustomer, setEditing, fetchCustomers }) => {
    const [formData, setFormData] = useState({
        name: currentCustomer ? currentCustomer.name : '',
        address: currentCustomer ? currentCustomer.address : '',
        tinNo: currentCustomer ? currentCustomer.tinNo : '',
        telephoneNo: currentCustomer ? currentCustomer.telephoneNo : ''
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
            if (currentCustomer) {
                await updateCustomer(currentCustomer._id, formData);
            } else {
                await createCustomer(formData);
            }
            fetchCustomers();
            setEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="card glass form-container slide-in">
            <div className="card-header">
                <h2>{currentCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
                <button className="btn-icon" onClick={() => setEditing(false)}>
                    <X size={20} />
                </button>
            </div>
            
            {error && <div className="alert-error">{error}</div>}
            
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>Customer Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="e.g. Pure Tech Solutions (Pvt) Ltd"
                    />
                </div>
                
                <div className="form-group">
                    <label>Address *</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Enter full address"
                        rows="3"
                    ></textarea>
                </div>
                
                <div className="form-row">
                    <div className="form-group half-width">
                        <label>TIN Number</label>
                        <input
                            type="text"
                            name="tinNo"
                            value={formData.tinNo}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. 102218191"
                        />
                    </div>
                    
                    <div className="form-group half-width">
                        <label>Telephone Number</label>
                        <input
                            type="text"
                            name="telephoneNo"
                            value={formData.telephoneNo}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. 0112-514747"
                        />
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        <Save size={18} /> {currentCustomer ? 'Update Customer' : 'Save Customer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CustomerForm;
