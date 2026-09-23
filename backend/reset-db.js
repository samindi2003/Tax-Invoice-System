async function resetDatabase() {
    try {
        console.log('Resetting database and seeding two distinct companies...');

        // 1. Get all companies to delete them
        const compRes = await fetch('http://localhost:5000/api/companies');
        const companies = await compRes.json();
        
        for (const c of companies) {
            await fetch(`http://localhost:5000/api/companies/${c._id}`, { method: 'DELETE' });
        }
        
        // 2. Create I-Net
        console.log('Creating I-Net Systems...');
        const inetRes = await fetch('http://localhost:5000/api/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'I-Net System & Solutions',
                address: '100 Tech Park',
                password: '' // No password
            })
        });
        const inet = await inetRes.json();

        // 3. Add I-Net Products
        const inetItems = [
            { name: 'Web Development', category: 'Service', description: 'Corporate Website', unitPrice: 150000 },
            { name: 'ERP Software License', category: 'Software', description: 'Annual License', unitPrice: 200000 },
            { name: 'Network Router', category: 'Product', description: 'Cisco Router', unitPrice: 45000 }
        ];
        
        for (const item of inetItems) {
            await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'company-id': inet._id },
                body: JSON.stringify(item)
            });
        }

        // 4. Create Global Traders
        console.log('Creating Global Traders...');
        const globalRes = await fetch('http://localhost:5000/api/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Global Traders',
                address: '789 Export Ave',
                password: 'password123'
            })
        });
        const global = await globalRes.json();

        // 5. Add Global Traders Products
        const globalItems = [
            { name: 'Imported Leather Chairs', category: 'Product', description: 'Premium Office Chairs', unitPrice: 45000 },
            { name: 'Customs Clearance Service', category: 'Service', description: 'Handling customs', unitPrice: 15000 },
            { name: 'Inventory Tracking App', category: 'Software', description: 'Mobile app for warehouse', unitPrice: 85000 }
        ];

        for (const item of globalItems) {
            await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'company-id': global._id },
                body: JSON.stringify(item)
            });
        }

        console.log('✅ Successfully reset and seeded the database with distinct items for I-Net and Global Traders!');
    } catch (error) {
        console.error('Error during reset:', error);
    }
}

resetDatabase();
