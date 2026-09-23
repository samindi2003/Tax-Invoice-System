async function addThirdCompany() {
    try {
        console.log('Creating Global Traders...');
        const newCompRes = await fetch('http://localhost:5000/api/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Global Traders',
                address: '789 Export Ave, Colombo 03',
                contactPerson: 'Director',
                contactNo: '0119876543',
                email: 'sales@globaltraders.lk',
                tinNo: '112233445',
                companyCode: 'GLOBAL',
                password: 'password123'
            })
        });
        
        if (!newCompRes.ok) throw new Error('Failed to create company');
        
        const newComp = await newCompRes.json();
        const companyId = newComp._id;
        
        console.log(`Created Company! ID: ${companyId}`);

        const mockItems = [
            {
                name: 'Imported Leather Chairs',
                category: 'Product',
                description: 'Premium ergonomic office chairs',
                referenceNumber: 'GLB-CH-01',
                unitPrice: 45000.00,
                quantity: 100,
                taxRate: 18,
                salesRep: 'Nimal Fernando',
                status: 'Active'
            },
            {
                name: 'Customs Clearance Service',
                category: 'Service',
                description: 'Handling customs clearance and forwarding',
                referenceNumber: 'GLB-SRV-01',
                unitPrice: 15000.00,
                quantity: 1,
                taxRate: 0,
                salesRep: 'Amal Silva',
                status: 'Active'
            }
        ];

        let added = 0;
        for (const item of mockItems) {
            try {
                const res = await fetch('http://localhost:5000/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'company-id': companyId
                    },
                    body: JSON.stringify(item)
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                console.log(`Added to Global Traders: ${item.name} (${item.category})`);
                added++;
            } catch (err) {
                console.error(`Failed to add ${item.name}: ${err.message}`);
            }
        }
        
        console.log(`\nSuccessfully added Global Traders with password 'password123' and ${added} distinct items!`);
    } catch (error) {
        console.error('Script failed:', error.message);
    }
}

addThirdCompany();
