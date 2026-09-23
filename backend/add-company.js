async function addSecondCompany() {
    try {
        console.log('Creating TechNova Solutions...');
        const newCompRes = await fetch('http://localhost:5000/api/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'TechNova Solutions',
                address: '456 Innovation Park, Kandy',
                contactPerson: 'Manager',
                contactNo: '0812345678',
                email: 'hello@technova.lk',
                tinNo: '987654321',
                companyCode: 'TECHNO'
            })
        });
        
        if (!newCompRes.ok) throw new Error('Failed to create company');
        
        const newComp = await newCompRes.json();
        const companyId = newComp._id;
        
        console.log(`Created Company! ID: ${companyId}`);

        const mockItems = [
            {
                name: 'TechNova Analytics Dashboard',
                category: 'Software',
                description: 'Proprietary analytics platform (Monthly)',
                referenceNumber: 'SFT-TN-01',
                unitPrice: 55000.00,
                quantity: 1,
                taxRate: 18,
                salesRep: 'Amal Silva',
                status: 'Active'
            },
            {
                name: 'Cloud Hosting Setup',
                category: 'Service',
                description: 'One-time AWS architecture setup and migration',
                referenceNumber: 'SRV-AWS-01',
                unitPrice: 120000.00,
                quantity: 1,
                taxRate: 0,
                salesRep: 'Kasun Perera',
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
                console.log(`Added to TechNova: ${item.name} (${item.category})`);
                added++;
            } catch (err) {
                console.error(`Failed to add ${item.name}: ${err.message}`);
            }
        }
        
        console.log(`\nSuccessfully added TechNova Solutions with ${added} distinct items!`);
    } catch (error) {
        console.error('Script failed:', error.message);
    }
}

addSecondCompany();
