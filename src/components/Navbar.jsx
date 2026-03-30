import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, ShoppingBag, Store, History, User, Package, MapPin, Clock } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const getAuthItem = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);
        const token = getAuthItem('access_token');
        const userRole = getAuthItem('role');
        const name = getAuthItem('user_name');
        setIsLoggedIn(!!token);
        setRole(userRole);
        setUserName(name || '');
    }, [location]);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setIsLoggedIn(false);
        setRole(null);
        navigate('/login');
    };

    const getNavLinks = () => {
        if (!isLoggedIn) return [];

        const baseLinks = [
            { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        ];

        if (role === 'admin' || role === 'manager') {
            return [
                ...baseLinks,
                { name: 'Routes', path: '/routes', icon: MapPin },
                { name: 'Inventory', path: '/inventory', icon: Package },
                { name: 'Pending', path: '/pending-orders', icon: Clock },
                { name: 'All Orders', path: '/history', icon: History },
            ];
        }

        if (role === 'sr') {
            return [
                ...baseLinks,
                { name: 'Shops', path: '/shops', icon: Store },
                { name: 'My Orders', path: '/history', icon: History },
            ];
        }

        if (role === 'shopkeeper') {
            return [
                ...baseLinks,
                { name: 'My Orders', path: '/history', icon: History },
            ];
        }

        return baseLinks;
    };

    const navLinks = getNavLinks();

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition">
                                <ShoppingBag className="h-6 w-6 text-white" />
                            </div>
                            <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                                DokanDhara
                            </span>
                        </Link>
                        
                        <div className="hidden md:ml-8 md:flex md:space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        location.pathname === link.path
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <link.icon className="w-4 h-4 mr-2" />
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {isLoggedIn && (
                            <div className="flex items-center mr-4 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold mr-2">
                                    {userName.charAt(0) || 'U'}
                                </div>
                                <span className="text-xs font-semibold text-gray-700">{userName}</span>
                                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-[8px] text-white rounded-md uppercase tracking-tighter">{role}</span>
                            </div>
                        )}
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-red-500 hover:bg-red-600 shadow-sm transition"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md transition"
                            >
                                <User className="w-4 h-4 mr-2" />
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-2 px-4 space-y-1">
                    {isLoggedIn && (
                        <div className="px-4 py-3 flex items-center border-b border-gray-50 mb-2">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold mr-3">
                                {userName.charAt(0) || 'U'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{userName}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">{role}</p>
                            </div>
                        </div>
                    )}
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center px-4 py-3 rounded-xl text-base font-medium ${
                                location.pathname === link.path
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <link.icon className="w-5 h-5 mr-3" />
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 pb-2 border-t border-gray-100">
                        {isLoggedIn ? (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
                                }}
                                className="flex w-full items-center px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="flex w-full items-center px-4 py-3 rounded-xl text-base font-medium bg-blue-600 text-white"
                            >
                                <User className="w-5 h-5 mr-3" />
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
