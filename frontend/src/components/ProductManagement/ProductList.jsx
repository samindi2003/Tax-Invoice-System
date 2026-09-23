import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../../services/api';
import ProductForm from './ProductForm';
import { Plus, Edit2, Trash2, Package, DollarSign, Monitor, Wrench } from 'lucide-react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getProducts();
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteProduct(id);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentProduct(null);
        setIsEditing(true);
    };

    const productsList = products.filter(p => p.category === 'Product');
    const servicesList = products.filter(p => p.category === 'Service');
    const softwareList = products.filter(p => p.category === 'Software');

    const renderTable = (items, categoryName, icon) => {
        if (items.length === 0) return null;
        
        return (
            <div className="mb-8 slide-in-up">
                <div className="flex items-center gap-2 mb-4">
                    {icon}
                    <h3 className="title m-0" style={{ fontSize: '1.25rem' }}>{categoryName}</h3>
                </div>
                <div className="table-responsive">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Reference / P.O.</th>
                                <th>Description</th>
                                <th>Unit Price</th>
                                <th>Stock Qty</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item._id} className="table-row">
                                    <td>
                                        <div className="font-bold text-blue">{item.name}</div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            {item.referenceNumber ? (
                                                <span className="font-medium text-sm">Ref: {item.referenceNumber}</span>
                                            ) : null}
                                            {item.poNumber ? (
                                                <span className="font-medium text-sm text-muted">P.O: {item.poNumber}</span>
                                            ) : null}
                                            {!item.referenceNumber && !item.poNumber && <span className="text-muted">-</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-medium text-sm line-clamp-2">{item.description}</div>
                                    </td>
                                    <td>
                                        <div className="badge badge-alt">
                                            <DollarSign size={12} /> {item.unitPrice.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}
                                        </div>
                                        {item.taxRate > 0 && <div className="text-xs text-muted mt-1">+ {item.taxRate}% VAT</div>}
                                    </td>
                                    <td>
                                        <div className="font-medium">{item.quantity > 0 ? item.quantity : '-'}</div>
                                    </td>
                                    <td>
                                        <span className={`badge ${item.status === 'Active' ? 'text-green-500' : 'text-red'}`}>{item.status || 'Active'}</span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="btn-icon text-blue" 
                                                onClick={() => handleEdit(item)}
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                className="btn-icon text-red" 
                                                onClick={() => handleDelete(item._id)}
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
            </div>
        );
    };

    return (
        <div className="product-management">
            <div className="header-section fade-in">
                <div>
                    <h1 className="title">Items & Services</h1>
                    <p className="subtitle">Manage the physical products, professional services, and software you bill for.</p>
                </div>
                {!isEditing && (
                    <button className="btn btn-primary pulse-hover flex items-center gap-2" onClick={handleAddNew}>
                        <Plus size={20} /> Add New Item
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="form-wrapper">
                    <ProductForm 
                        currentProduct={currentProduct} 
                        setEditing={setIsEditing} 
                        fetchProducts={fetchProducts} 
                    />
                </div>
            ) : (
                <div className="card glass list-container fade-in-up" style={{ padding: '2rem' }}>
                    {loading ? (
                        <div className="loader">Loading items...</div>
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            <Package size={48} className="empty-icon" />
                            <h3>No Items Found</h3>
                            <p>Get started by adding your first product, service, or software.</p>
                            <button className="btn btn-outline flex items-center gap-2" onClick={handleAddNew}>
                                <Plus size={18} /> Add Item
                            </button>
                        </div>
                    ) : (
                        <div>
                            {renderTable(productsList, 'Products', <Package className="text-blue" size={24} />)}
                            {renderTable(servicesList, 'Professional Services', <Wrench className="text-green-500" size={24} color="#10b981" />)}
                            {renderTable(softwareList, 'Software Solutions', <Monitor className="text-purple-500" size={24} color="#8b5cf6" />)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductList;
