import React, { useState, useEffect, useRef } from 'react';
import CustomerList from './components/CustomerManagement/CustomerList';
import ProductList from './components/ProductManagement/ProductList';
import CompanyProfile from './components/Settings/CompanyProfile';
import Login from './components/Auth/Login';
import UserProfile from './components/Admin/UserProfile';
import ChangePassword from './components/Admin/ChangePassword';
import InvoiceList from './components/InvoiceManagement/InvoiceList';
import Dashboard from './components/Dashboard/Dashboard';
import { LayoutDashboard, Users, FileText, Settings, Package, Moon, Sun, User, Key, LogOut, ChevronDown, Building } from 'lucide-react';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef(null);

  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // In a real app, validate token with backend here
      setIsAuthenticated(true);
      setCurrentUser({ name: 'Admin User', email: 'admin@company.com' });
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsDropdownOpen(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'customers':
        return <CustomerList />;
      case 'products':
        return <ProductList />;
      case 'invoices':
        return <InvoiceList />;
      case 'settings':
        return <CompanyProfile />;
      case 'user-profile':
        return <UserProfile />;
      case 'change-password':
        return <ChangePassword />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar glass-dark">
        <div className="sidebar-brand">
          <div className="brand-logo">TI</div>
          <h2>Tax Invoice</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          
          <button 
            className={`nav-item ${activeView === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveView('customers')}
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
          >
            <Users size={20} />
            <span>Customers</span>
          </button>
          
          <button 
            className={`nav-item ${activeView === 'products' ? 'active' : ''}`}
            onClick={() => setActiveView('products')}
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
          >
            <Package size={20} />
            <span>Products</span>
          </button>
          
          <button 
            className={`nav-item ${activeView === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveView('invoices')}
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
          >
            <FileText size={20} />
            <span>Invoices</span>
          </button>
          
          <button 
            className={`nav-item ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveView('settings')}
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar glass">
          <div className="search-bar">
            <input type="text" placeholder="Search..." className="input-field" />
          </div>
          <div className="user-profile" ref={dropdownRef}>
            <div 
              className="user-profile-trigger" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="avatar">{currentUser?.name?.substring(0, 2).toUpperCase() || 'AD'}</div>
              <div className="user-info">
                <span className="user-name">{currentUser?.name || 'Admin User'}</span>
              </div>
              <ChevronDown size={16} className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
            </div>

            {isDropdownOpen && (
              <div className="dropdown-menu glass slide-in-down">
                <div className="dropdown-header">
                  <div className="avatar sm">{currentUser?.name?.substring(0, 2).toUpperCase() || 'AD'}</div>
                  <div>
                    <p className="font-medium">{currentUser?.name || 'Admin User'}</p>
                    <p className="text-muted text-sm">{currentUser?.email || 'admin@company.com'}</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                
                <button 
                  className="dropdown-item" 
                  onClick={() => { setIsDarkMode(!isDarkMode); setIsDropdownOpen(false); }}
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                
                <button 
                  className="dropdown-item" 
                  onClick={() => { setActiveView('settings'); setIsDropdownOpen(false); }}
                >
                  <Building size={18} />
                  <span>Company Profile</span>
                </button>
                
                <button 
                  className="dropdown-item" 
                  onClick={() => { setActiveView('user-profile'); setIsDropdownOpen(false); }}
                >
                  <User size={18} />
                  <span>User Profile</span>
                </button>
                
                <button 
                  className="dropdown-item" 
                  onClick={() => { setActiveView('change-password'); setIsDropdownOpen(false); }}
                >
                  <Key size={18} />
                  <span>Change Password</span>
                </button>
                
                <div className="dropdown-divider"></div>
                
                <button 
                  className="dropdown-item text-red" 
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
