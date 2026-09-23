const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');

// @desc    Get dashboard summary metrics
// @route   GET /api/dashboard/summary
// @access  Public (for now)
const getDashboardSummary = async (req, res) => {
    const companyId = req.headers['company-id'];
    if (!companyId) {
        return res.status(400).json({ message: 'Company ID is required in headers' });
    }

    try {
        // Attempt to fetch real counts scoped to companyId
        const customerCount = await Customer.countDocuments({ companyId });
        const productCount = await Product.countDocuments({ companyId });

        // Calculate Invoice metrics scoped to companyId
        const invoices = await Invoice.find({ companyId }).populate('customer', 'name');
        
        const invoicesIssued = invoices.length;
        const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
        const totalVat = invoices.reduce((sum, inv) => sum + inv.vatAmount, 0);
        
        const paidInvoices = invoices.filter(inv => inv.status === 'Paid').length;
        const pendingInvoices = invoices.filter(inv => inv.status === 'Pending').length;

        // Get 4 most recent invoices for the table
        const recentInvoices = await Invoice.find({ companyId })
            .sort({ createdAt: -1 })
            .limit(4)
            .populate('customer', 'name');

        const mappedRecent = recentInvoices.map(inv => ({
            id: inv.invoiceNo,
            customer: inv.customer?.name || 'Unknown',
            date: inv.date.toISOString().split('T')[0],
            amount: inv.grandTotal,
            status: inv.status
        }));

        // Calculate chart data (last 6 months)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const chartData = [];
        const currentDate = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthName = monthNames[d.getMonth()];
            
            // Sum revenue for this specific month
            const monthlyRevenue = invoices
                .filter(inv => inv.date.getMonth() === d.getMonth() && inv.date.getFullYear() === d.getFullYear())
                .reduce((sum, inv) => sum + inv.grandTotal, 0);
                
            chartData.push({ name: monthName, revenue: monthlyRevenue });
        }

        res.json({
            metrics: {
                totalRevenue,
                totalVat,
                invoicesIssued,
                activeCustomers: customerCount || 0,
                paidInvoices,
                pendingInvoices
            },
            recentInvoices: mappedRecent,
            chartData
        });
    } catch (error) {
        console.error('Dashboard DB Error, serving fallback data:', error);
        // Fallback if DB is completely offline
        res.json({
            metrics: {
                totalRevenue: 0,
                totalVat: 0,
                invoicesIssued: 0,
                activeCustomers: 0,
                paidInvoices: 0,
                pendingInvoices: 0
            },
            recentInvoices: []
        });
    }
};

module.exports = {
    getDashboardSummary
};
