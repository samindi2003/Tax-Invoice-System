import React, { useState, useEffect } from 'react';
import { getDashboardSummary } from '../../services/api';
import {
    IndianRupee,
    FileText,
    Users,
    TrendingUp,
    PlusCircle,
    UserPlus,
    PackagePlus
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR'
    }).format(amount);
};

const Dashboard = ({ setActiveView }) => {
    const [summary, setSummary] = useState({
        metrics: {
            totalRevenue: 0,
            totalVat: 0,
            invoicesIssued: 0,
            activeCustomers: 0
        },
        recentInvoices: [],
        chartData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await getDashboardSummary();
                setSummary(response.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ color: 'var(--text-muted)' }}>Loading Dashboard...</div>
            </div>
        );
    }

    const { metrics, recentInvoices, chartData } = summary;

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title">Dashboard Overview</h1>
                    <p className="subtitle">Here is a summary of your business performance.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn btn-primary pulse-hover"
                        onClick={() => setActiveView('products')}
                    >
                        <PackagePlus size={18} />
                        New Product
                    </button>
                    <button
                        className="btn btn-primary pulse-hover"
                        onClick={() => setActiveView('customers')}
                    >
                        <UserPlus size={18} />
                        New Customer
                    </button>
                    <button
                        className="btn btn-primary pulse-hover"
                        onClick={() => setActiveView('invoices')}
                    >
                        <PlusCircle size={18} />
                        Create Invoice
                    </button>
                </div>
            </div>

            {/* KPIs / Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {/* Revenue Card */}
                <div className="card glass slide-in-down" style={{ margin: 0, padding: '1.5rem', animationDelay: '0.1s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p className="text-muted text-sm font-medium">Total Revenue</p>
                            <h3 style={{ fontSize: '1.75rem', margin: '0.5rem 0', color: 'var(--text-main)' }}>
                                {formatCurrency(metrics.totalRevenue)}
                            </h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 'var(--radius-md)' }}>
                            <IndianRupee size={24} />
                        </div>
                    </div>
                    <p className="text-sm" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <TrendingUp size={14} />
                        <span>+12.5% from last month</span>
                    </p>
                </div>

                {/* VAT Card */}
                <div className="card glass slide-in-down" style={{ margin: 0, padding: '1.5rem', animationDelay: '0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p className="text-muted text-sm font-medium">VAT Collected (18%)</p>
                            <h3 style={{ fontSize: '1.75rem', margin: '0.5rem 0', color: 'var(--text-main)' }}>
                                {formatCurrency(metrics.totalVat)}
                            </h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: 'var(--radius-md)' }}>
                            <FileText size={24} />
                        </div>
                    </div>
                    <p className="text-muted text-sm">
                        Pending remittance to Inland Revenue
                    </p>
                </div>

                {/* Invoices Card */}
                <div className="card glass slide-in-down" style={{ margin: 0, padding: '1.5rem', animationDelay: '0.3s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p className="text-muted text-sm font-medium">Invoices Issued</p>
                            <h3 style={{ fontSize: '1.75rem', margin: '0.5rem 0', color: 'var(--text-main)' }}>
                                {metrics.invoicesIssued}
                            </h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
                            <FileText size={24} />
                        </div>
                    </div>
                    <p className="text-muted text-sm">
                        Total invoices generated to date
                    </p>
                </div>

                {/* Customers Card */}
                <div className="card glass slide-in-down" style={{ margin: 0, padding: '1.5rem', animationDelay: '0.4s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p className="text-muted text-sm font-medium">Active Customers</p>
                            <h3 style={{ fontSize: '1.75rem', margin: '0.5rem 0', color: 'var(--text-main)' }}>
                                {metrics.activeCustomers}
                            </h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', borderRadius: 'var(--radius-md)' }}>
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="text-muted text-sm">
                        Registered in your system
                    </p>
                </div>
            </div>

            {/* Bottom Row: Chart & Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Chart Section */}
                <div className="card glass slide-in-up" style={{ margin: 0, padding: '1.5rem', animationDelay: '0.5s' }}>
                    <h3 style={{ margin: '0 0 1.5rem' }}>Revenue Trend (Last 6 Months)</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-muted)' }}
                                    tickFormatter={(value) => `LKR ${value / 1000}k`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'var(--border-color)' }}
                                    contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                                    formatter={(value) => [`LKR ${new Intl.NumberFormat('en-LK').format(value)}`, 'Revenue']}
                                />
                                <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Invoices Section */}
                <div className="card glass slide-in-up" style={{ margin: 0, padding: '1.5rem', animationDelay: '0.6s', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Recent Invoices</h3>
                        <button
                            className="text-primary text-sm font-medium"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            onClick={() => setActiveView('invoices')}
                        >
                            View All
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentInvoices.map((inv, idx) => (
                            <div key={idx} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '1rem', background: 'rgba(0,0,0,0.02)',
                                borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)'
                            }}>
                                <div>
                                    <p className="font-medium" style={{ margin: '0 0 0.25rem' }}>{inv.customer}</p>
                                    <p className="text-muted text-sm" style={{ margin: 0 }}>{inv.id} • {inv.date}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p className="font-medium" style={{ margin: '0 0 0.25rem', color: 'var(--text-main)' }}>
                                        {formatCurrency(inv.amount)}
                                    </p>
                                    <span className="badge" style={{
                                        background: inv.status === 'Paid' ? 'rgba(16, 185, 129, 0.1)' :
                                            inv.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: inv.status === 'Paid' ? '#10b981' :
                                            inv.status === 'Pending' ? '#f59e0b' : '#ef4444',
                                        fontSize: '0.75rem', padding: '0.1rem 0.5rem', borderRadius: '1rem'
                                    }}>
                                        {inv.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentInvoices.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                No recent invoices found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
