require('dotenv').config();
const mongoose = require('mongoose');

const Company = require('./models/Company');
const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Invoice = require('./models/Invoice');

async function seed() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected! Wiping old data...');
        
        await Company.deleteMany({});
        await Customer.deleteMany({});
        await Product.deleteMany({});
        await Invoice.deleteMany({});
        console.log('Data wiped.');

        console.log('Creating I-Net System & Solutions...');
        const inet = await Company.create({
            name: 'I-Net System & Solutions',
            address: '123 Tech Avenue, Colombo 03',
            password: 'password123'
        });

        const inetCustomers = await Customer.insertMany([
            { companyId: inet._id, name: 'Dialog Axiata', email: 'billing@dialog.lk', phone: '0112345678', address: 'Union Place, Colombo 02', tinNumber: 'TIN-DLG-001' },
            { companyId: inet._id, name: 'SLT Mobitel', email: 'finance@slt.lk', phone: '0112555666', address: 'Lotus Road, Colombo 01', tinNumber: 'TIN-SLT-002' }
        ]);

        const inetProducts = await Product.insertMany([
            { companyId: inet._id, name: 'Network Installation', category: 'Service', description: 'Enterprise networking setup', unitPrice: 120000, quantity: 1, taxRate: 18 },
            { companyId: inet._id, name: 'Cisco Router ASR', category: 'Product', description: 'High-end router', unitPrice: 850000, quantity: 5, taxRate: 18 },
            { companyId: inet._id, name: 'Firewall License', category: 'Software', description: '1-year license', unitPrice: 45000, quantity: 1, taxRate: 0 }
        ]);

        await Invoice.create({
            companyId: inet._id,
            invoiceNo: 'INV-0001',
            customer: inetCustomers[0]._id,
            products: [{ 
                product: inetProducts[0]._id, 
                quantity: 1, 
                unitPrice: 120000, 
                amount: 120000 
            }],
            subtotal: 120000,
            vatAmount: 21600,
            grandTotal: 141600,
            date: new Date()
        });

        console.log('Creating TechNova IT Solutions...');
        const technova = await Company.create({
            name: 'TechNova IT Solutions',
            address: '45 Innovation Drive, Kandy',
            password: 'password123'
        });

        const technovaCustomers = await Customer.insertMany([
            { companyId: technova._id, name: 'Creative Labs', email: 'hello@creativelabs.com', phone: '0812345678', address: '78 Art St, Kandy', tinNumber: 'TIN-CL-999' },
            { companyId: technova._id, name: 'Global Logistics', email: 'accounts@globallogistics.com', phone: '0813344556', address: '12 Warehouse Rd, Kandy', tinNumber: 'TIN-GL-888' }
        ]);

        const technovaProducts = await Product.insertMany([
            { companyId: technova._id, name: 'Web Application Development', category: 'Service', description: 'Custom ERP System', unitPrice: 500000, quantity: 1, taxRate: 0 },
            { companyId: technova._id, name: 'UI/UX Design Package', category: 'Service', description: 'Design prototypes', unitPrice: 150000, quantity: 1, taxRate: 18 },
            { companyId: technova._id, name: 'TechNova Analytics', category: 'Software', description: 'Monthly subscription', unitPrice: 25000, quantity: 12, taxRate: 18 }
        ]);

        await Invoice.create({
            companyId: technova._id,
            invoiceNo: 'INV-0001',
            customer: technovaCustomers[0]._id,
            products: [
                { product: technovaProducts[0]._id, quantity: 1, unitPrice: 500000, amount: 500000 }, 
                { product: technovaProducts[1]._id, quantity: 1, unitPrice: 150000, amount: 150000 }
            ],
            subtotal: 650000,
            vatAmount: 27000,
            grandTotal: 677000,
            date: new Date()
        });

        console.log('✅ Database completely reset and seeded with I-Net and TechNova examples!');
        process.exit(0);
    } catch(e) {
        console.error('Failed to seed:', e);
        process.exit(1);
    }
}

seed();
