async function seedCustomers() {
    try {
        console.log('Fetching companies...');
        const compRes = await fetch('http://localhost:5000/api/companies');
        const companies = await compRes.json();
        
        const inet = companies.find(c => c.name.includes('I-Net'));
        const globalTraders = companies.find(c => c.name.includes('Global Traders'));

        if (!inet || !globalTraders) {
            console.error('Companies not found! Please run reset-db.js first.');
            return;
        }

        // Add I-Net Customers
        const inetCustomers = [
            { name: 'TechStart Inc', email: 'hello@techstart.io', phone: '0112233445', address: '12 Silicon Ave, Colombo 04', tinNumber: 'TIN-TS-001' },
            { name: 'CloudNet Solutions', email: 'billing@cloudnet.lk', phone: '0119988776', address: '45 IT Park, Malabe', tinNumber: 'TIN-CN-002' }
        ];

        console.log('Seeding I-Net Customers...');
        for (const cust of inetCustomers) {
            await fetch('http://localhost:5000/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'company-id': inet._id },
                body: JSON.stringify(cust)
            });
            console.log(` Added: ${cust.name}`);
        }

        // Add Global Traders Customers
        const globalCustomers = [
            { name: 'Lanka Furniture Mart', email: 'purchasing@lankafurniture.com', phone: '0114455667', address: '88 Timber Road, Moratuwa', tinNumber: 'TIN-LFM-888' },
            { name: 'Oceanic Shipping Co', email: 'accounts@oceanic.lk', phone: '0117766554', address: '22 Port City, Colombo 01', tinNumber: 'TIN-OSC-999' },
            { name: 'Mega Retail Supermarkets', email: 'vendor@megaretail.lk', phone: '0113322110', address: '500 Galle Road, Colombo 03', tinNumber: 'TIN-MRS-777' }
        ];

        console.log('\nSeeding Global Traders Customers...');
        for (const cust of globalCustomers) {
            await fetch('http://localhost:5000/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'company-id': globalTraders._id },
                body: JSON.stringify(cust)
            });
            console.log(` Added: ${cust.name}`);
        }

        console.log('\n✅ Successfully added distinct customers for both companies!');
    } catch (error) {
        console.error('Script failed:', error);
    }
}

seedCustomers();
