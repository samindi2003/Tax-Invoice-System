import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../../services/api';
import ProductForm from './ProductForm';
import { Plus, Edit2, Trash2, Package, DollarSign } from 'lucide-react';

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
        if (window.confirm('Are you sure you want to delete this product?')) {
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

    return (
        <div className="product-management">
            <div className="header-section fade-in">
                <div>
                    <h1 className="title">Product Management</h1>
                    <p className="subtitle">Manage the goods and services you bill for.</p>
                </div>
                {!isEditing && (
                    <button className="btn btn-primary pulse-hover" onClick={handleAddNew}>
                        <Plus size={20} /> Add New Product
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
                <div className="card glass list-container fade-in-up">
                    {loading ? (
                        <div className="loader">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            <Package size={48} className="empty-icon" />
                            <h3>No Products Found</h3>
                            <p>Get started by adding your first product or service.</p>
                            <button className="btn btn-outline" onClick={handleAddNew}>
                                <Plus size={18} /> Add Product
                            </button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Reference Number</th>
                                        <th>Description</th>
                                        <th>Unit Price</th>
                                        <th>Stock Qty</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id} className="table-row">
                                            <td>
                                                <div className="font-bold text-blue">{product.name}</div>
                                            </td>
                                            <td>
                                                {product.referenceNumber ? (
                                                    <span className="font-medium">{product.referenceNumber}</span>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="font-medium text-sm">{product.description}</div>
                                            </td>
                                            <td>
                                                <div className="badge badge-alt">
                                                    <DollarSign size={12} /> {product.unitPrice.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-medium">{product.quantity || 0}</div>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="btn-icon text-blue" 
                                                        onClick={() => handleEdit(product)}
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button 
                                                        className="btn-icon text-red" 
                                                        onClick={() => handleDelete(product._id)}
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

export default ProductList;
