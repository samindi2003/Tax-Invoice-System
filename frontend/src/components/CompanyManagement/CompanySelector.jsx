import React, { useState, useEffect } from 'react';
import { getCompanies, verifyCompanyPassword } from '../../services/api';

const CompanySelector = () => {
    const [companies, setCompanies] = useState([]);
    const [activeCompanyId, setActiveCompanyId] = useState(localStorage.getItem('activeCompanyId') || '');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const { data } = await getCompanies();
                setCompanies(data);
            } catch (err) {
                console.error("Failed to load companies for selector", err);
            }
        };
        fetchCompanies();
    }, []);

    const handleChange = async (e) => {
        const selectedId = e.target.value;
        if (!selectedId) return;
        
        const company = companies.find(c => c._id === selectedId);
        
        if (company && company.password) {
            const entered = prompt(`Enter password for ${company.name}:`);
            if (entered === null) {
                // Revert select back to current active
                e.target.value = activeCompanyId;
                return;
            }
            
            try {
                const res = await verifyCompanyPassword(company._id, entered);
                if (!res.data.success) {
                    alert('Incorrect password!');
                    e.target.value = activeCompanyId;
                    return;
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Error verifying password');
                e.target.value = activeCompanyId;
                return;
            }
        }
        
        localStorage.setItem('activeCompanyId', selectedId);
        setActiveCompanyId(selectedId);
        window.location.reload(); // Reload to fetch fresh data for the newly selected company
    };

    return (
        <select 
            className="input-field" 
            style={{ width: '200px', padding: '0.4rem', borderColor: 'var(--primary)' }}
            value={activeCompanyId} 
            onChange={handleChange}
        >
            <option value="" disabled>Select a Company...</option>
            {companies.map(c => (
                <option key={c._id} value={c._id}>
                    {c.name} {c.password ? ' 🔒' : ''}
                </option>
            ))}
        </select>
    );
};

export default CompanySelector;
