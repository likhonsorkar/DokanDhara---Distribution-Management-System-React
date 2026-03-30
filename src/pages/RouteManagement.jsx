import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
    MapPin, Search, Loader2, Printer, CheckCircle2, 
    ChevronRight, ShoppingBag, Plus, MoreVertical, 
    Truck, BarChart3, Clock, AlertTriangle, Store
} from 'lucide-react';

const RouteManagement = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRouteInvoices, setSelectedRouteInvoices] = useState(null);
    const [printingRouteName, setPrintingRouteName] = useState('');

    const fetchRoutes = async () => {
        try {
            const res = await api.get('routes/');
            setRoutes(res.data.results || res.data);
        } catch (err) {
            console.error("Error fetching routes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const handlePrintRouteInvoices = async (routeId, routeName) => {
        try {
            const res = await api.get(`routes/${routeId}/pending-orders/`);
            if (res.data.length === 0) {
                alert("No pending orders for this route.");
                return;
            }
            setSelectedRouteInvoices(res.data);
            setPrintingRouteName(routeName);
            setTimeout(() => {
                window.print();
            }, 500);
        } catch (err) {
            console.error("Error fetching route invoices:", err);
        }
    };

    const handleConfirmAll = async (routeId, routeName) => {
        if (!window.confirm(`Are you sure you want to confirm ALL pending orders for ${routeName}?`)) return;
        
        try {
            await api.post(`routes/${routeId}/confirm-all/`);
            alert(`Orders for ${routeName} confirmed successfully.`);
            fetchRoutes();
        } catch (err) {
            console.error("Error confirming all orders:", err);
        }
    };

    const filteredRoutes = routes.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium text-sm">Organizing distribution routes...</p>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <style>
                {`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    .invoice-break { page-break-after: always; }
                    @page { size: A4; margin: 0.5cm; }
                }
                .print-only { display: none; }
                `}
            </style>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Route Management</h1>
                    <p className="text-gray-500 mt-1 italic font-medium text-sm">Efficient route-wise dispatch and bulk processing</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Search size={18} />
                        </div>
                        <input 
                            type="text"
                            placeholder="Search route name..."
                            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full md:w-64 transition bg-white shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 no-print">
                {filteredRoutes.map(route => (
                    <div key={route.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition group">
                        <div className="p-6 border-b border-gray-50">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                                    <MapPin size={24} />
                                </div>
                                <div className="text-right">
                                    {route.pending_order_count > 0 && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-tighter border border-orange-100 animate-pulse">
                                            {route.pending_order_count} Pending
                                        </span>
                                    )}
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{route.name}</h3>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                                    <Store size={12} className="mr-1.5 text-blue-500" />
                                    {route.shop_count || 0} Shops
                                </span>
                                <span className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                                    <Clock size={12} className="mr-1.5 text-orange-500" />
                                    {route.pending_order_count || 0} Invoices
                                </span>
                            </div>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-3 bg-gray-50/50">
                            <button 
                                onClick={() => handlePrintRouteInvoices(route.id, route.name)}
                                disabled={!route.pending_order_count}
                                className="flex items-center justify-center gap-2 bg-white text-gray-700 py-3 rounded-2xl text-xs font-bold border border-gray-100 hover:bg-blue-50 hover:text-blue-600 transition shadow-sm disabled:opacity-50 disabled:grayscale"
                            >
                                <Printer size={16} /> Print All
                            </button>
                            <button 
                                onClick={() => handleConfirmAll(route.id, route.name)}
                                disabled={!route.pending_order_count}
                                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-2xl text-xs font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:bg-gray-300 disabled:shadow-none"
                            >
                                <CheckCircle2 size={16} /> Confirm All
                            </button>
                        </div>
                    </div>
                ))}

                {filteredRoutes.length === 0 && (
                    <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
                        <MapPin className="mx-auto text-gray-200 mb-2" size={48} />
                        <p className="text-gray-400 font-medium italic">No routes found matching your search</p>
                    </div>
                )}
            </div>

            {/* Hidden Print All View */}
            {selectedRouteInvoices && (
                <div className="print-only">
                    {selectedRouteInvoices.map((order, index) => (
                        <div key={order.id} className={`bg-white p-4 font-sans ${index !== selectedRouteInvoices.length - 1 ? 'invoice-break' : ''}`}>
                            <div className="flex justify-between items-start border-b-2 border-gray-900 pb-4 mb-4">
                                <div>
                                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">DOKANDHARA</h1>
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Route Distribution: {printingRouteName}</p>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-2xl font-black text-gray-900 mb-1 uppercase">DISTRIBUTION MEMO</h2>
                                    <p className="text-sm font-bold text-gray-600">INVOICE NO: #{order.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-12 mb-6">
                                <div>
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">BILL TO (RETAILER)</h4>
                                    <p className="text-2xl font-black text-gray-900 mb-1 uppercase">{order.shop_name}</p>
                                    <p className="text-md text-gray-600 mb-1">{order.shop_address}</p>
                                    <p className="text-md font-bold text-gray-900">Route: {order.route_name}</p>
                                </div>
                                <div className="text-right">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">DISTRIBUTION DETAILS</h4>
                                    <div className="space-y-2">
                                        <p className="text-md"><span className="text-gray-400 font-bold uppercase text-[10px] mr-2">Assigned SR:</span> <span className="font-bold">{order.sr_name}</span></p>
                                        <p className="text-md"><span className="text-gray-400 font-bold uppercase text-[10px] mr-2">Date:</span> <span className="font-bold">{new Date(order.created_at).toLocaleDateString()}</span></p>
                                        {/* <p className="text-md"><span className="text-gray-400 font-bold uppercase text-[10px] mr-2">Status:</span> <span className="font-black uppercase text-blue-600">{order.status}</span></p> */}
                                    </div>
                                </div>
                            </div>

                            <table className="w-full mb-12 border-collapse">
                                <thead>
                                    <tr className="border-y-2 border-gray-900">
                                        <th className="py-2 text-left font-black uppercase text-xs tracking-widest">Product Description</th>
                                        <th className="py-2 text-center font-black uppercase text-xs tracking-widest">Quantity</th>
                                        <th className="py-2 text-right font-black uppercase text-xs tracking-widest">Rate (৳)</th>
                                        <th className="py-2 text-right font-black uppercase text-xs tracking-widest">Amount (৳)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {order.items?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-1">
                                                <p className="font-black text-lg text-gray-900 uppercase leading-tight">{item.product_name}</p>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">SKU: {item.product_sku || 'GENERAL-SKU'}</p>
                                            </td>
                                            <td className="py-1 text-center">
                                                <p className="text-xl font-black text-gray-900">{item.quantity}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">{item.product_unit || 'PCS'}</p>
                                            </td>
                                            <td className="py-1 text-right font-bold text-lg text-gray-900">
                                                {parseFloat(item.unit_price).toLocaleString()}
                                            </td>
                                            <td className="py-1 text-right font-black text-xl text-gray-900">
                                                {(item.quantity * item.unit_price).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-gray-900">
                                        <td colSpan="3" className="py-2 text-right font-black text-lg uppercase tracking-widest pr-6">GRAND TOTAL</td>
                                        <td className="py-2 text-right font-black text-3xl text-blue-700 bg-gray-50 px-4">৳{parseFloat(order.total_amount).toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>

                            <div className="grid grid-cols-2 gap-20 mt-10">
                                <div className="text-center border-t border-gray-400 pt-4">
                                    <p className="font-black text-[8px] uppercase tracking-widest text-gray-400 mb-1">Retailer Acknowledgement</p>
                                    <div className="h-4"></div>
                                </div>
                                <div className="text-center border-t border-gray-400 pt-4">
                                    <p className="font-black text-[8px] uppercase tracking-widest text-gray-400 mb-1">Authorized Manager</p>
                                    <div className="h-4"></div>
                                </div>
                            </div>
                            
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RouteManagement;
