import axios from 'axios';

const API_URL = import.meta.env.PROD ? 'https://tax-invoice-system.vercel.app/api' : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const companyId = localStorage.getItem('activeCompanyId');
    if (companyId) {
        config.headers['company-id'] = companyId;
    }
    return config;
}, (error) => Promise.reject(error));

export const getCustomers = () => api.get('/customers');
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const createCustomer = (customerData) => api.post('/customers', customerData);
export const updateCustomer = (id, customerData) => api.put(`/customers/${id}`, customerData);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

// Products
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (productData) => api.post('/products', productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Settings
export const getSettings = () => api.get('/settings');
export const updateSettings = (settingsData) => api.put('/settings', settingsData);

// Dashboard
export const getDashboardSummary = () => api.get('/dashboard/summary');

// Invoices
export const getInvoices = () => api.get('/invoices');
export const createInvoice = (invoiceData) => api.post('/invoices', invoiceData);
export const updateInvoice = (id, invoiceData) => api.put(`/invoices/${id}`, invoiceData);
export const getInvoiceById = (id) => api.get(`/invoices/${id}`);
export const deleteInvoice = (id) => api.delete(`/invoices/${id}`);
export const emailInvoice = (id, payload) => api.post(`/invoices/${id}/email`, payload);

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const getUserProfile = () => api.get('/auth/profile');
export const updatePassword = (passwords) => api.put('/auth/password', passwords);

// Companies
export const getCompanies = () => api.get('/companies');
export const getCompany = (id) => api.get(`/companies/${id}`);
export const createCompany = (companyData) => api.post('/companies', companyData);
export const updateCompany = (id, companyData) => api.put(`/companies/${id}`, companyData);
export const deleteCompany = (id) => api.delete(`/companies/${id}`);
export const verifyCompanyPassword = (id, password) => api.post(`/companies/${id}/verify`, { password });

export default api;
