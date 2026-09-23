import React, { useState, useEffect } from 'react';
import { Building, Plus, Edit2, Trash2, CheckCircle, Image as ImageIcon, Lock } from 'lucide-react';
import { getCompanies, createCompany, updateCompany, deleteCompany, verifyCompanyPassword } from '../../services/api';

const CompanyList = ({ setActiveCompanyId }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    telephoneNo: '',
    email: '',
    tinNo: '',
    otherInfo: '',
    logo: '',
    password: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data } = await getCompanies();
      setCompanies(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCompany(editingId, formData);
      } else {
        await createCompany(formData);
      }
      setShowModal(false);
      fetchCompanies();
      // Reset form
      setFormData({ name: '', address: '', telephoneNo: '', email: '', tinNo: '', otherInfo: '', logo: '', password: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving company:', error);
    }
  };

  const handleEdit = (company) => {
    setFormData({
      name: company.name,
      address: company.address,
      telephoneNo: company.telephoneNo || '',
      email: company.email || '',
      tinNo: company.tinNo || '',
      otherInfo: company.otherInfo || '',
      logo: company.logo || '',
      password: company.password || ''
    });
    setEditingId(company._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company? All data associated with it may be orphaned.')) {
      try {
        await deleteCompany(id);
        fetchCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  };

  const setAsActive = async (company) => {
    try {
        if (company.password) {
            const entered = prompt(`Enter password for ${company.name}:`);
            if (entered === null) return; // User cancelled

            const res = await verifyCompanyPassword(company._id, entered);
            if (!res.data.success) {
                alert('Incorrect password!');
                return;
            }
        }
        localStorage.setItem('activeCompanyId', company._id);
        setActiveCompanyId(company._id);
        window.location.reload();
    } catch (err) {
        alert(err.response?.data?.message || 'Error verifying password');
    }
  };

  return (
    <div className="company-list fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="title">Manage Companies</h2>
          <p className="subtitle">Add and switch between multiple companies in your portfolio.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2 pulse-hover" onClick={() => {
            setEditingId(null);
            setFormData({ name: '', address: '', telephoneNo: '', email: '', tinNo: '', otherInfo: '', logo: '', password: '' });
            setShowModal(true);
        }}>
          <Plus size={18} /> Add Company
        </button>
      </div>

      <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full loader">Loading companies...</div>
        ) : companies.length === 0 ? (
          <div className="empty-state glass w-full" style={{ gridColumn: '1 / -1' }}>
            <Building size={48} className="empty-icon" />
            <h3>No companies found</h3>
            <p>Create your first company profile to get started with invoicing.</p>
          </div>
        ) : (
          companies.map(company => (
            <div key={company._id} className="card p-4 glass relative flex flex-col" style={{ padding: '1.5rem', minHeight: '300px' }}>
              {localStorage.getItem('activeCompanyId') === company._id && (
                 <span className="badge" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <CheckCircle size={14} /> Active
                 </span>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '8px', background: '#fff', padding: '4px' }} />
                ) : (
                  <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                    {company.name.charAt(0)}
                  </div>
                )}
                <h3 className="title" style={{ fontSize: '1.25rem', margin: 0 }}>{company.name}</h3>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <p className="text-sm text-muted"><strong>Address:</strong> {company.address}</p>
                <p className="text-sm text-muted"><strong>TIN:</strong> {company.tinNo || 'N/A'}</p>
                <p className="text-sm text-muted"><strong>Email:</strong> {company.email || 'N/A'}</p>
                <p className="text-sm text-muted"><strong>Phone:</strong> {company.telephoneNo || 'N/A'}</p>
                {company.otherInfo && (
                  <p className="text-sm text-muted line-clamp-2" style={{ marginTop: '0.5rem', fontStyle: 'italic', background: 'rgba(0,0,0,0.03)', padding: '0.5rem', borderRadius: '4px' }}>
                    {company.otherInfo}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <button 
                  className={`btn flex-1 text-sm ${localStorage.getItem('activeCompanyId') === company._id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setAsActive(company)}
                  disabled={localStorage.getItem('activeCompanyId') === company._id}
                >
                  {localStorage.getItem('activeCompanyId') === company._id ? 'Current Active' : 'Select'}
                </button>
                <button className="btn btn-outline text-sm px-3" onClick={() => handleEdit(company)}>
                  <Edit2 size={16} />
                </button>
                <button className="btn btn-danger text-sm px-3" onClick={() => handleDelete(company._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass slide-in-down" style={{ maxWidth: '600px' }}>
            <h3 className="title mb-6">{editingId ? 'Edit Company' : 'Add New Company'}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Logo Upload Section */}
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg mb-2" style={{ borderColor: 'var(--border-color)', background: 'rgba(255,255,255,0.3)' }}>
                {formData.logo ? (
                  <div className="relative">
                    <img src={formData.logo} alt="Preview" style={{ height: '80px', objectFit: 'contain', borderRadius: '4px' }} />
                    <button type="button" onClick={() => setFormData({...formData, logo: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">x</button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center text-muted" style={{ cursor: 'pointer' }}>
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-sm">Click to upload Company Logo</span>
                    <input type="file" accept="image/*" className="hidden" style={{ display: 'none' }} onChange={handleLogoUpload} />
                  </label>
                )}
              </div>

              <div className="grid md-grid-cols-2 gap-4">
                <div>
                  <label>Company Name *</label>
                  <input type="text" name="name" className="input-field" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>TIN Number</label>
                  <input type="text" name="tinNo" className="input-field" value={formData.tinNo} onChange={handleInputChange} />
                </div>
              </div>
              
              <div>
                <label>Address *</label>
                <textarea name="address" className="input-field" rows="2" value={formData.address} onChange={handleInputChange} required></textarea>
              </div>
              
              <div className="grid md-grid-cols-2 gap-4">
                <div>
                  <label>Email</label>
                  <input type="email" name="email" className="input-field" value={formData.email} onChange={handleInputChange} />
                </div>
                <div>
                  <label>Telephone</label>
                  <input type="text" name="telephoneNo" className="input-field" value={formData.telephoneNo} onChange={handleInputChange} />
                </div>
              </div>

              <div>
                <label>Company Password (Optional)</label>
                <input type="password" name="password" className="input-field" placeholder="Leave blank for no password" value={formData.password} onChange={handleInputChange} />
              </div>

              <div>
                <label>Other Company Information</label>
                <textarea name="otherInfo" className="input-field" rows="3" placeholder="Website, secondary addresses, registration numbers, etc." value={formData.otherInfo} onChange={handleInputChange}></textarea>
              </div>
              
              <div className="flex justify-end gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Save'} Company</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
