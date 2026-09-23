
async function seedProducts() {
    try {
        console.log('Fetching companies...');
        const compRes = await fetch('http://localhost:5000/api/companies');
        const companies = await compRes.json();
        
        let companyId;
        
        if (companies.length === 0) {
            console.log('No companies found! Creating a default test company...');
            const newCompRes = await fetch('http://localhost:5000/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Acme Corporation',
                    address: '123 Business Rd, Colombo',
                    contactPerson: 'Admin',
                    contactNo: '0112345678',
                    email: 'admin@acmecorp.com',
                    tinNo: '123456789',
                    companyCode: 'ACME'
                })
            });
            const newComp = await newCompRes.json();
            companyId = newComp._id;
        } else {
            companyId = companies[0]._id;
        }

        console.log(`Using Company ID: ${companyId}`);

        const config = {
            headers: {
                'company-id': companyId
            }
        };

        const mockItems = [
            // PRODUCTS
            {
                name: 'Dell XPS 15 Laptop',
                category: 'Product',
                description: 'Intel Core i7, 16GB RAM, 512GB SSD, Windows 11 Pro',
                referenceNumber: 'SKU-D15',
                poNumber: '',
                unitPrice: 450000.00,
                quantity: 12,
                taxRate: 18,
                salesRep: 'Kasun Perera',
                status: 'Active'
            },
            {
                name: 'Logitech MX Master 3S',
                category: 'Product',
                description: 'Wireless Performance Mouse',
                referenceNumber: 'SKU-LMX3',
                poNumber: '',
                unitPrice: 35000.00,
                quantity: 45,
                taxRate: 18,
                salesRep: 'Nimal Fernando',
                status: 'Active'
            },
            {
                name: 'Cisco Catalyst Switch 24-port',
                category: 'Product',
                description: 'Cisco Catalyst 1000 Series 24-port Gigabit Ethernet switch',
                referenceNumber: 'SKU-C1000',
                poNumber: 'PO-NET-99',
                unitPrice: 120000.00,
                quantity: 5,
                taxRate: 18,
                salesRep: 'Amal Silva',
                status: 'Active'
            },
            // SERVICES
            {
                name: 'Website Development',
                category: 'Service',
                description: 'Custom corporate website development including UI/UX design (5 pages)',
                referenceNumber: 'SRV-WEB-01',
                poNumber: '',
                unitPrice: 150000.00,
                quantity: 1,
                taxRate: 0,
                salesRep: 'Kasun Perera',
                status: 'Active'
            },
            {
                name: 'Server Maintenance (Monthly)',
                category: 'Service',
                description: 'Monthly routine server maintenance, backup verification, and security patching',
                referenceNumber: 'SRV-MNT-02',
                poNumber: '',
                unitPrice: 25000.00,
                quantity: 1,
                taxRate: 18,
                salesRep: 'Amal Silva',
                status: 'Active'
            },
            {
                name: 'IT Consultation (Hourly)',
                category: 'Service',
                description: 'Network infrastructure planning and IT security consultation',
                referenceNumber: 'SRV-CON-03',
                poNumber: '',
                unitPrice: 8000.00,
                quantity: 10,
                taxRate: 0,
                salesRep: 'Nimal Fernando',
                status: 'Active'
            },
            // SOFTWARE
            {
                name: 'Enterprise HRM System',
                category: 'Software',
                description: 'Human Resource Management System with Payroll, Attendance, and Leave modules (Annual License)',
                referenceNumber: 'SFT-HRM-01',
                poNumber: '',
                unitPrice: 250000.00,
                quantity: 1,
                taxRate: 18,
                salesRep: 'Kasun Perera',
                status: 'Active'
            },
            {
                name: 'Cloud POS Subscription (Monthly)',
                category: 'Software',
                description: 'Point of Sale Cloud Subscription - Multi-branch support',
                referenceNumber: 'SFT-POS-02',
                poNumber: '',
                unitPrice: 15000.00,
                quantity: 12,
                taxRate: 18,
                salesRep: 'Amal Silva',
                status: 'Active'
            },
            {
                name: 'Custom ERP Module Integration',
                category: 'Software',
                description: 'One-time integration of custom accounting module with existing ERP',
                referenceNumber: 'SFT-ERP-03',
                poNumber: '',
                unitPrice: 350000.00,
                quantity: 1,
                taxRate: 18,
                salesRep: 'Nimal Fernando',
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
                console.log(`Added: ${item.name} (${item.category})`);
                added++;
            } catch (err) {
                console.error(`Failed to add ${item.name}: ${err.message}`);
            }
        }
        
        console.log(`\nSuccessfully added ${added} items! Refresh your page to see them.`);
    } catch (error) {
        console.error('Script failed:', error.message);
    }
}

seedProducts();
