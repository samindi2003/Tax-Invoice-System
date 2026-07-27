import React, { useState, useEffect } from 'react';
import { getCustomers, deleteCustomer } from '../../services/api';
import CustomerForm from './CustomerForm';
import { Plus, Edit2, Trash2, Building, Phone, Hash } from 'lucide-react';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await getCustomers();
            setCustomers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await deleteCustomer(id);
                fetchCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        }
    };

    const handleEdit = (customer) => {
        setCurrentCustomer(customer);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentCustomer(null);
        setIsEditing(true);
    };

    return (
        <div className="customer-management">
            <div className="header-section fade-in">
                <div>
                    <h1 className="title">Customer Management</h1>
                    <p className="subtitle">Manage your day-to-day clients and their billing details.</p>
                </div>
                {!isEditing && (
                    <button className="btn btn-primary pulse-hover" onClick={handleAddNew}>
                        <Plus size={20} /> Add New Customer
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="form-wrapper">
                    <CustomerForm 
                        currentCustomer={currentCustomer} 
                        setEditing={setIsEditing} 
                        fetchCustomers={fetchCustomers} 
                    />
                </div>
            ) : (
                <div className="card glass list-container fade-in-up">
                    {loading ? (
                        <div className="loader">Loading customers...</div>
                    ) : customers.length === 0 ? (
                        <div className="empty-state">
                            <Building size={48} className="empty-icon" />
                            <h3>No Customers Found</h3>
                            <p>Get started by adding your first customer.</p>
                            <button className="btn btn-outline" onClick={handleAddNew}>
                                <Plus size={18} /> Add Customer
                            </button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Customer Name</th>
                                        <th>Address</th>
                                        <th>Contact Details</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer) => (
                                        <tr key={customer._id} className="table-row">
                                            <td>
                                                <div className="font-medium">{customer.name}</div>
                                            </td>
                                            <td>
                                                <div className="text-muted text-sm">{customer.address}</div>
                                            </td>
                                            <td>
                                                <div className="contact-info">
                                                    {customer.telephoneNo && (
                                                        <span className="badge">
                                                            <Phone size={12} /> {customer.telephoneNo}
                                                        </span>
                                                    )}
                                                    {customer.tinNo && (
                                                        <span className="badge badge-alt">
                                                            <Hash size={12} /> TIN: {customer.tinNo}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="btn-icon text-blue" 
                                                        onClick={() => handleEdit(customer)}
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button 
                                                        className="btn-icon text-red" 
                                                        onClick={() => handleDelete(customer._id)}
                                                        title="Delete"
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
        </div>
    );
};

export default CustomerList;
