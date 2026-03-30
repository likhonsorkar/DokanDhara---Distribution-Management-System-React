import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
    ShoppingBag, Store, TrendingUp, Users, Clock, ArrowUpRight, 
    Loader2, Package, AlertTriangle, CheckCircle2, List, 
    Truck, BarChart3, ChevronRight, History as HistoryIcon,
    PlusCircle, XCircle, MapPin, Footprints, Edit3
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// --- Shared Components ---

const StatCard = ({ title, value, icon, bg, trend, subValue, to }) => {
    const content = (
        <>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${bg}`}>
                    {icon}
                </div>
                {trend && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{trend}</span>}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
                {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
            </div>
        </>
    );

    const className = `bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition group text-left w-full ${to ? 'hover:shadow-md hover:border-blue-100 cursor-pointer' : ''}`;

    if (to) {
        return <Link to={to} className={className}>{content}</Link>;
    }

    return (
        <div className={className}>
            {content}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-orange-50 text-orange-600 border-orange-100",
        confirmed: "bg-blue-50 text-blue-600 border-blue-100",
        processing: "bg-purple-50 text-purple-600 border-purple-100",
        delivered: "bg-green-50 text-green-600 border-green-100",
        cancelled: "bg-red-50 text-red-600 border-red-100"
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.pending}`}>
            {status}
        </span>
    );
};

// --- Role Specific Dashboards ---

const ManagerDashboard = ({ data }) => {
    const { summary, pending_orders_action, sr_performance, top_products, recent_orders } = data;
    
    const stats = [
        { title: "Today's Sales", value: `৳${(summary?.total_sales_today || 0).toLocaleString()}`, icon: <TrendingUp className="text-green-600" />, bg: "bg-green-50", trend: "Today" },
        { title: "Monthly Sales", value: `৳${(summary?.total_sales_month || 0).toLocaleString()}`, icon: <BarChart3 className="text-blue-600" />, bg: "bg-blue-50", trend: "This Month" },
        { 
            title: "Pending Orders", 
            value: summary?.total_orders_pending || 0, 
            icon: <Clock className="text-orange-600" />, 
            bg: "bg-orange-50", 
            trend: "Action Required",
            to: "/pending-orders?filter=pending"
        },
        { 
            title: "Low Stock", 
            value: summary?.low_stock_alerts || 0, 
            icon: <AlertTriangle className="text-red-600" />, 
            bg: "bg-red-50", 
            trend: "Alerts",
            to: "/inventory?filter=low_stock"
        },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Orders Action */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 flex items-center">
                            <Clock className="mr-2 text-orange-500" size={18} />
                            Pending Orders for Action
                        </h3>
                        <Link to="/pending-orders?filter=pending" className="text-xs text-blue-600 font-bold hover:underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shop & Route</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">SR</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {pending_orders_action?.slice(0, 5).map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-sm text-gray-900">{order.shop_name}</p>
                                            <p className="text-[10px] text-gray-400 uppercase">{order.route_name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{order.sr_name}</td>
                                        <td className="px-6 py-4 font-black text-sm text-gray-900">৳{order.total_amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link to="/pending-orders" className="text-blue-600 hover:text-blue-800 transition">
                                                <ChevronRight size={20} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {(!pending_orders_action || pending_orders_action.length === 0) && (
                                    <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400 text-sm">No pending orders</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50">
                        <h3 className="font-bold text-gray-900 flex items-center">
                            <Package className="mr-2 text-blue-500" size={18} />
                            Top Products
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {top_products?.map((p, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 mr-3">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{p.product__name}</p>
                                        <p className="text-[10px] text-gray-400">{p.total_qty} units sold</p>
                                    </div>
                                </div>
                                <p className="text-sm font-black text-gray-900">৳{p.total_revenue.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SR Performance */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900 flex items-center">
                        <Users className="mr-2 text-purple-500" size={18} />
                        SR Performance
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">SR Name</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Today's Sales</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Month's Sales</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orders (Month)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sr_performance?.map((sr, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-sm text-gray-900">{sr.first_name} {sr.last_name}</p>
                                        <p className="text-[10px] text-gray-400">{sr.phone_number}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-green-600">৳{(sr.sales_today || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm font-black text-gray-900">৳{(sr.sales_month || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{sr.order_count_month}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SRDashboard = ({ data }) => {
    const { summary, recent_orders } = data;
    const navigate = useNavigate();
    
    const stats = [
        { title: "My Sales Today", value: `৳${(summary?.my_sales_today || 0).toLocaleString()}`, icon: <TrendingUp className="text-green-600" />, bg: "bg-green-50", trend: "Live Tracking" },
        { title: "Monthly Sales", value: `৳${(summary?.my_sales_month || 0).toLocaleString()}`, icon: <BarChart3 className="text-blue-600" />, bg: "bg-blue-50", trend: "This Month" },
        { title: "Today's Orders", value: summary?.my_orders_today || 0, icon: <ShoppingBag className="text-orange-600" />, bg: "bg-orange-50", trend: "Confirmed Memos", to: "/history" },
        { title: "Today's Visits", value: summary?.my_visits_today || 0, icon: <Footprints className="text-purple-600" />, bg: "bg-purple-50", trend: "Retailer Touchpoints" },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Quick Terminal</h2>
                            <ArrowUpRight className="text-gray-300" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link 
                                to="/shops"
                                className="flex items-center p-6 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 group"
                            >
                                <div className="bg-white/20 p-3 rounded-xl mr-4 group-hover:scale-110 transition">
                                    <PlusCircle size={24} />
                                </div>
                                <div>
                                    <p className="font-bold">New distribution</p>
                                    <p className="text-[10px] text-blue-100 font-medium uppercase tracking-wider">Visit assigned shops</p>
                                </div>
                            </Link>
                            <Link 
                                to="/history"
                                className="flex items-center p-6 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 border border-gray-100 transition group"
                            >
                                <div className="bg-white p-3 rounded-xl mr-4 shadow-sm group-hover:scale-110 transition">
                                    <HistoryIcon className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <p className="font-bold">View history</p>
                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Track your performance</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Recent 10 Activities</h2>
                            <Link to="/history" className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">View All Archives</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Memo ID</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Retailer</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Amount</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recent_orders?.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition group">
                                            <td className="px-4 py-4 text-xs font-mono font-bold text-blue-600">#{order.id}</td>
                                            <td className="px-4 py-4">
                                                <p className="text-sm font-bold text-gray-900 truncate uppercase">{order.shop_name}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-black text-gray-900 text-center">৳{order.total_amount.toLocaleString()}</td>
                                            <td className="px-4 py-4 text-center"><StatusBadge status={order.status} /></td>
                                            <td className="px-4 py-4 text-right">
                                                {order.status === 'pending' ? (
                                                    <button 
                                                        onClick={() => navigate('/createorder', { 
                                                            state: { 
                                                                shopId: order.shop_id, 
                                                                shopName: order.shop_name,
                                                                editOrderId: order.id,
                                                                existingItems: order.items 
                                                            } 
                                                        })}
                                                        className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm"
                                                        title="Modify Memo Items"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                ) : (
                                                    <button className="p-2 text-gray-300 cursor-not-allowed">
                                                        <XCircle size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!recent_orders || recent_orders.length === 0) && (
                                        <tr><td colSpan="5" className="p-10 text-center text-gray-400 text-sm italic">No recent memos captured yet</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-2">My Territory</h3>
                            <p className="text-blue-100 text-sm mb-8 leading-relaxed italic">You are currently covering {summary?.total_shops_assigned || 0} active retailers.</p>
                            
                            <div className="space-y-4">
                                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 mb-1">Visit efficiency</p>
                                    <p className="text-2xl font-black">{((summary?.my_visits_today || 0) / (summary?.total_shops_assigned || 1) * 100).toFixed(1)}%</p>
                                </div>
                                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 mb-1">Avg Order Value</p>
                                    <p className="text-2xl font-black">৳{(summary?.my_sales_today || 0) / (summary?.my_orders_today || 1) ? ((summary?.my_sales_today || 0) / (summary?.my_orders_today || 1)).toLocaleString() : 0}</p>
                                </div>
                            </div>
                        </div>
                        <ShoppingBag className="absolute -right-8 -bottom-8 text-white/5 w-48 h-48" />
                    </div>

                    <div className="bg-orange-50 rounded-[32px] p-8 border border-orange-100">
                        <h4 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <AlertTriangle size={16} /> Notice Board
                        </h4>
                        <p className="text-xs text-orange-800/70 font-medium leading-relaxed">
                            Memos marked as <span className="font-bold">Pending</span> can be updated before manager confirmation. Once confirmed, contact manager for any changes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ShopkeeperDashboard = ({ data }) => {
    const { summary, recent_orders } = data;
    
    const stats = [
        { title: "Total Expenditure", value: `৳${(summary?.total_spent || 0).toLocaleString()}`, icon: <TrendingUp className="text-blue-600" />, bg: "bg-blue-50", trend: "Lifetime", to: "/history" },
        { title: "Pending Delivery", value: summary?.pending_orders || 0, icon: <Clock className="text-orange-600" />, bg: "bg-orange-50", trend: "On the way", to: "/history" },
        { title: "Delivered Orders", value: summary?.delivered_orders || 0, icon: <CheckCircle2 className="text-green-600" />, bg: "bg-green-50", trend: "Completed", to: "/history" },
        { title: "My Shops", value: summary?.total_shops || 0, icon: <Store className="text-purple-600" />, bg: "bg-purple-50", trend: "Registered" },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Quick Terminal</h2>
                            <ArrowUpRight className="text-gray-300" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link 
                                to="/shops"
                                className="flex items-center p-6 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 group"
                            >
                                <div className="bg-white/20 p-3 rounded-xl mr-4 group-hover:scale-110 transition">
                                    <PlusCircle size={24} />
                                </div>
                                <div>
                                    <p className="font-bold">New order</p>
                                    <p className="text-[10px] text-blue-100 font-medium uppercase tracking-wider">Place order for your shops</p>
                                </div>
                            </Link>
                            <Link 
                                to="/history"
                                className="flex items-center p-6 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 border border-gray-100 transition group"
                            >
                                <div className="bg-white p-3 rounded-xl mr-4 shadow-sm group-hover:scale-110 transition">
                                    <HistoryIcon className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <p className="font-bold">Order History</p>
                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Track your expenditures</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Recent Order Tracking</h3>
                            <Link to="/history" className="text-sm text-blue-600 font-bold">See History</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                                        <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shop</th>
                                        <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recent_orders?.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{order.shop_name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm font-black text-gray-900">৳{order.total_amount.toLocaleString()}</td>
                                            <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-2">My Network</h3>
                            <p className="text-blue-100 text-sm mb-8 leading-relaxed italic">You are currently managing {summary?.total_shops || 0} registered shops.</p>
                            
                            <div className="space-y-4">
                                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 mb-1">Total Spent</p>
                                    <p className="text-2xl font-black">৳{(summary?.total_spent || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <ShoppingBag className="absolute -right-8 -bottom-8 text-white/5 w-48 h-48" />
                    </div>

                    <div className="bg-orange-50 rounded-[32px] p-8 border border-orange-100">
                        <h4 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <AlertTriangle size={16} /> Retailer Notice
                        </h4>
                        <p className="text-xs text-orange-800/70 font-medium leading-relaxed">
                            You can place orders directly for any of your registered shops. These will be processed using the standard FIFO logic from our central warehouse.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Dashboard Controller ---

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const getAuthItem = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);
    const role = getAuthItem('role') || 'sr';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Determine endpoint based on role
                let endpoint = 'dashboard/sr/';
                if (role === 'admin' || role === 'manager') endpoint = 'dashboard/manager/';
                else if (role === 'shopkeeper') endpoint = 'dashboard/shopkeeper/';

                const res = await api.get(endpoint);
                setData(res.data);
            } catch (err) {
                console.error("Dashboard data error:", err);
                setError("Failed to load dashboard data. Please check your internet connection and try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [role]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium italic">Synchronizing distribution data...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
            <div className="bg-red-50 p-6 rounded-[40px] mb-6">
                <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Access Restricted</h2>
            <p className="text-gray-500 mb-8 max-w-md italic font-medium">{error}</p>
            <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-blue-600 text-white rounded-[20px] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:scale-105 transition-all active:scale-95"
            >
                Retry Connection
            </button>
        </div>
    );

    const renderRoleDashboard = () => {
        switch (role) {
            case 'admin':
            case 'manager':
                return <ManagerDashboard data={data} />;
            case 'shopkeeper':
                return <ShopkeeperDashboard data={data} />;
            default:
                return <SRDashboard data={data} />;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 no-print">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                        {role === 'admin' ? 'Administrator' : role.toUpperCase()} CONSOLE
                    </h1>
                    <p className="text-gray-500 mt-1 italic font-medium">
                        Distribution activity hub for {getAuthItem('user_name') || 'Authorized User'}.
                    </p>
                </div>
                <div className="flex items-center space-x-3 bg-white px-5 py-2.5 rounded-[20px] shadow-sm border border-gray-100 text-xs font-black text-gray-500 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Network Online</span>
                </div>
            </div>
            
            {renderRoleDashboard()}
        </div>
    );
};

export default Dashboard;
