async function seedCloud() {
    try {
        console.log('Seeding Cloud Database...');

        // 1. Create Company 1: TechNova IT
        console.log('Creating TechNova IT...');
        const techRes = await fetch('http://localhost:5000/api/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'TechNova IT Solutions',
                address: '100 Silicon Way, Colombo 04',
                password: 'password123'
            })
        });
        const tech = await techRes.json();

        // Add Products for TechNova
        const techProducts = [
            { name: 'Web Development', category: 'Service', description: 'Corporate Website', unitPrice: 150000, quantity: 1, taxRate: 0 },
            { name: 'Cloud Server Setup', category: 'Service', description: 'AWS Setup', unitPrice: 85000, quantity: 1, taxRate: 18 },
            { name: 'Accounting Software', category: 'Software', description: 'Annual License', unitPrice: 200000, quantity: 1, taxRate: 18 }
        ];
        
        let techProductIds = [];
        for (const item of techProducts) {
            const pRes = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'company-id': tech._id },
                body: JSON.stringify(item)
            });
            const p = await pRes.json();
            techProductIds.push(p._id);
        }

        // Add Customers for TechNova
        const techCustomers = [
            { name: 'CloudNet Inc', email: 'hello@cloudnet.io', phone: '0112233445', address: '12 Tech Park', tinNumber: 'TIN-CN-001' },
            { name: 'Startup Hub', email: 'billing@startuphub.lk', phone: '0119988776', address: '45 Startup Ave', tinNumber: 'TIN-SH-002' }
        ];
        
        let techCustomerIds = [];
        for (const cust of techCustomers) {
            const cRes = await fetch('http://localhost:5000/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'company-id': tech._id },
                body: JSON.stringify(cust)
            });
            const c = await cRes.json();
            techCustomerIds.push(c._id);
        }

        // Add 1 Invoice for TechNova
        console.log('Creating Invoice for TechNova...');
        await fetch('http://localhost:5000/api/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'company-id': tech._id },
            body: JSON.stringify({
                customer: techCustomerIds[0],
                products: [{ product: techProductIds[0], quantity: 1 }],
                date: new Date().toISOString()
            })
        });

        // 2. Create Company 2: MegaBuilders
        console.log('\nCreating MegaBuilders...');
        const megaRes = await fetch('http://localhost:5000/api/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'MegaBuilders Construction',
                address: '789 Industrial Rd, Kandy',
                password: 'password123'
            })
        });
        const mega = await megaRes.json();

        // Add Products for MegaBuilders
        const megaProducts = [
            { name: 'Cement Bags (50kg)', category: 'Product', description: 'Portland Cement', unitPrice: 2500, quantity: 100, taxRate: 18 },
            { name: 'Steel Rebar', category: 'Product', description: 'High Tensile Steel', unitPrice: 1500, quantity: 500, taxRate: 18 },
            { name: 'Architectural Design', category: 'Service', description: 'Blueprint design', unitPrice: 300000, quantity: 1, taxRate: 0 }
        ];
        
        let megaProductIds = [];
        for (const item of megaProducts) {
            const pRes = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'company-id': mega._id },
                body: JSON.stringify(item)
            });
            const p = await pRes.json();
            megaProductIds.push(p._id);
        }

        // Add Customers for MegaBuilders
        const megaCustomers = [
            { name: 'City Development Auth', email: 'purchasing@cda.gov.lk', phone: '0814455667', address: '88 Gov Road, Kandy', tinNumber: 'TIN-CDA-888' },
            { name: 'Luxury Villas Corp', email: 'accounts@luxuryvillas.lk', phone: '0817766554', address: '22 Estate Drive, Nuwara Eliya', tinNumber: 'TIN-LVC-999' }
        ];

        let megaCustomerIds = [];
        for (const cust of megaCustomers) {
            const cRes = await fetch('http://localhost:5000/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'company-id': mega._id },
                body: JSON.stringify(cust)
            });
            const c = await cRes.json();
            megaCustomerIds.push(c._id);
        }

        // Add 1 Invoice for MegaBuilders
        console.log('Creating Invoice for MegaBuilders...');
        await fetch('http://localhost:5000/api/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'company-id': mega._id },
            body: JSON.stringify({
                customer: megaCustomerIds[0],
                products: [{ product: megaProductIds[0], quantity: 50 }, { product: megaProductIds[1], quantity: 100 }],
                date: new Date().toISOString()
            })
        });

        console.log('\n✅ Successfully seeded the Cloud Database with 2 Companies, Customers, Products, and Invoices!');
    } catch (error) {
        console.error('Error during cloud seed:', error);
    }
}

seedCloud();
