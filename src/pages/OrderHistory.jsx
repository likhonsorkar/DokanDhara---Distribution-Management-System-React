import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
    FileText, Search, Loader2, Calendar, ShoppingBag, 
    ChevronDown, CheckCircle2, XCircle, Clock, Truck,
    AlertCircle, Printer, Filter, ArrowRight
} from 'lucide-react';

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

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const getAuthItem = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);
    const role = getAuthItem('role');

    const fetchOrders = async () => {
        try {
            const res = await api.get('orders/');
            setOrders(res.data.results || res.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handlePrint = async (orderId) => {
        try {
            const res = await api.get(`orders/${orderId}/invoice/`);
            setSelectedOrder(res.data);
            setTimeout(() => {
                window.print();
            }, 500);
        } catch (err) {
            console.error("Invoice error:", err);
        }
    };

    const toggleExpand = async (orderId) => {
        if (expandedOrder?.id === orderId) {
            setExpandedOrder(null);
        } else {
            try {
                const res = await api.get(`orders/${orderId}/invoice/`);
                setExpandedOrder(res.data);
            } catch (err) {
                console.error("Detail error:", err);
            }
        }
    };

    // Date grouping logic
    const isToday = (dateStr) => {
        const d = new Date(dateStr);
        const today = new Date();
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
    };

    const isYesterday = (dateStr) => {
        const d = new Date(dateStr);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return d.getDate() === yesterday.getDate() &&
               d.getMonth() === yesterday.getMonth() &&
               d.getFullYear() === yesterday.getFullYear();
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.id.toString().includes(searchTerm);
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const todayOrders = filteredOrders.filter(o => isToday(o.created_at));
    const yesterdayOrders = filteredOrders.filter(o => isYesterday(o.created_at));
    const olderOrders = filteredOrders.filter(o => !isToday(o.created_at) && !isYesterday(o.created_at));

    const renderOrderTable = (orderList, title) => {
        if (orderList.length === 0) return null;
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">{title}</h2>
                    <div className="flex-1 h-[1px] bg-gray-100 ml-2"></div>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-gray-50">
                                {orderList.map(order => (
                                    <React.Fragment key={order.id}>
                                        <tr className="hover:bg-blue-50/20 transition group">
                                            <td className="px-6 py-5">
                                                <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">#{order.id}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-gray-900 group-hover:text-blue-600 transition uppercase text-sm">{order.shop_name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center mt-0.5">
                                                    {order.route_name || 'N/A'} • {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="font-black text-gray-900">৳{parseFloat(order.total_amount).toLocaleString()}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="px-6 py-5 text-right space-x-2">
                                                <button 
                                                    onClick={() => toggleExpand(order.id)}
                                                    className={`p-2.5 rounded-xl transition shadow-sm border ${expandedOrder?.id === order.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 hover:text-blue-600 border-gray-100'}`}
                                                    title="Quick View"
                                                >
                                                    <ArrowRight size={18} className={expandedOrder?.id === order.id ? 'rotate-90 transition-transform' : ''} />
                                                </button>
                                                <button 
                                                    onClick={() => handlePrint(order.id)}
                                                    className="p-2.5 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition shadow-sm border border-gray-100"
                                                    title="Print Memo"
                                                >
                                                    <Printer size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedOrder?.id === order.id && (
                                            <tr className="bg-gray-50/50">
                                                <td colSpan="5" className="px-12 py-6">
                                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-inner overflow-hidden animate-in slide-in-from-top-2 duration-200">
                                                        <table className="w-full text-left text-xs">
                                                            <thead className="bg-gray-50">
                                                                <tr className="text-gray-400 border-b border-gray-50">
                                                                    <th className="px-6 py-3 font-bold uppercase tracking-widest">Product</th>
                                                                    <th className="px-6 py-3 font-bold uppercase tracking-widest text-center">Qty</th>
                                                                    <th className="px-6 py-3 font-bold uppercase tracking-widest text-right">Rate</th>
                                                                    <th className="px-6 py-3 font-bold uppercase tracking-widest text-right">Disc.</th>
                                                                    <th className="px-6 py-3 font-bold uppercase tracking-widest text-right">Amount</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-50">
                                                                {expandedOrder.items?.map((item, idx) => (
                                                                    <tr key={idx} className="hover:bg-blue-50/10 transition">
                                                                        <td className="px-6 py-3">
                                                                            <p className="font-bold text-gray-900 uppercase">{item.product_name}</p>
                                                                            <p className="text-[10px] text-gray-400 font-mono">SKU: {item.product_sku || 'N/A'}</p>
                                                                        </td>
                                                                        <td className="px-6 py-3 text-center">
                                                                            <span className="font-black text-gray-900">{item.quantity}</span>
                                                                            <span className="ml-1 text-[10px] text-gray-400 uppercase font-bold">{item.product_unit || 'pcs'}</span>
                                                                        </td>
                                                                        <td className="px-6 py-3 text-right">৳{parseFloat(item.unit_price).toLocaleString()}</td>
                                                                        <td className="px-6 py-3 text-right text-green-600 font-bold">{item.discount > 0 ? `৳${parseFloat(item.discount).toLocaleString()}` : '-'}</td>
                                                                        <td className="px-6 py-3 text-right font-black text-gray-900">৳{parseFloat(item.sub_total).toLocaleString()}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                            <tfoot className="bg-blue-50/10 font-bold">
                                                                <tr>
                                                                    <td colSpan="4" className="px-6 py-4 text-right uppercase tracking-widest text-[10px] text-gray-500">Net Payable</td>
                                                                    <td className="px-6 py-4 text-right text-sm text-blue-600 font-black">৳{parseFloat(expandedOrder.total_amount).toLocaleString()}</td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium italic">Loading your distribution history...</p>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <style>
                {`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    @page { size: A4; margin: 1cm; }
                }
                .print-only { display: none; }
                `}
            </style>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Order Archives</h1>
                    <p className="text-gray-500 mt-1 italic font-medium">Tracking the distribution flow</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <Search size={18} />
                        </div>
                        <input 
                            type="text"
                            placeholder="Memo ID or Shop name..."
                            className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-72 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex p-1 bg-gray-100 rounded-2xl">
                        {['all', 'pending', 'confirmed', 'delivered'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="no-print space-y-10 pb-20">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white p-20 rounded-[40px] border border-dashed border-gray-200 text-center">
                        <ShoppingBag className="mx-auto text-gray-200 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-gray-900">No Orders Found</h3>
                        <p className="text-gray-400 mt-2 italic">Try adjusting your filters or search term</p>
                    </div>
                ) : (
                    <>
                        {renderOrderTable(todayOrders, "Today's Distribution")}
                        {renderOrderTable(yesterdayOrders, "Yesterday")}
                        {renderOrderTable(olderOrders, "Earlier History")}
                    </>
                )}
            </div>

            {/* Print View Component (Reuse logic for professional invoice) */}
            {selectedOrder && (
                <div className="print-only w-full bg-white p-10 font-sans">
                    <div className="flex justify-between items-start border-b-2 border-gray-900 pb-8 mb-8">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">DOKANDHARA</h1>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center">Enterprise Distribution Management</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-black text-gray-900 mb-1 uppercase">DISTRIBUTION MEMO</h2>
                            <p className="text-sm font-bold text-gray-600">INVOICE NO: #{selectedOrder.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div>
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">BILL TO (RETAILER)</h4>
                            <p className="text-2xl font-black text-gray-900 mb-1 uppercase">{selectedOrder.shop_name}</p>
                            <p className="text-md text-gray-600 mb-1">{selectedOrder.shop_address}</p>
                            <p className="text-md font-bold text-gray-900">Route: {selectedOrder.route_name}</p>
                        </div>
                        <div className="text-right">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">DISTRIBUTION DETAILS</h4>
                            <div className="space-y-2">
                                <p className="text-md"><span className="text-gray-400 font-bold uppercase text-[10px] mr-2">Assigned SR:</span> <span className="font-bold uppercase">{selectedOrder.sr_name}</span></p>
                                <p className="text-md"><span className="text-gray-400 font-bold uppercase text-[10px] mr-2">Contact SR:</span> <span className="font-bold">{selectedOrder.sr_phone || 'N/A'}</span></p>
                                <p className="text-md"><span className="text-gray-400 font-bold uppercase text-[10px] mr-2">Date Created:</span> <span className="font-bold">{new Date(selectedOrder.created_at).toLocaleDateString()}</span></p>
                                <p className="text-md"><span className="text-gray-400 font-bold uppercase text-[10px] mr-2">Status:</span> <span className="font-black uppercase text-blue-600">{selectedOrder.status}</span></p>
                            </div>
                        </div>
                    </div>

                    <table className="w-full mb-12 border-collapse">
                        <thead>
                            <tr className="border-y-2 border-gray-900">
                                <th className="py-4 text-left font-black uppercase text-xs tracking-widest">Product Description</th>
                                <th className="py-4 text-center font-black uppercase text-xs tracking-widest">Quantity</th>
                                <th className="py-4 text-right font-black uppercase text-xs tracking-widest">Rate (৳)</th>
                                <th className="py-4 text-right font-black uppercase text-xs tracking-widest">Disc. (৳)</th>
                                <th className="py-4 text-right font-black uppercase text-xs tracking-widest">Amount (৳)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {selectedOrder.items?.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="py-6">
                                        <p className="font-black text-lg text-gray-900 uppercase leading-tight">{item.product_name}</p>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">SKU: {item.product_sku || 'GENERAL-SKU'}</p>
                                    </td>
                                    <td className="py-6 text-center">
                                        <p className="text-xl font-black text-gray-900">{item.quantity}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{item.product_unit || 'PCS'}</p>
                                    </td>
                                    <td className="py-6 text-right font-bold text-lg text-gray-900">
                                        {parseFloat(item.unit_price).toLocaleString()}
                                    </td>
                                    <td className="py-6 text-right font-bold text-lg text-green-600">
                                        {item.discount > 0 ? `-${parseFloat(item.discount).toLocaleString()}` : '0'}
                                    </td>
                                    <td className="py-6 text-right font-black text-xl text-gray-900">
                                        {parseFloat(item.sub_total).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-gray-900">
                                <td colSpan="4" className="py-6 text-right font-black text-lg uppercase tracking-widest pr-6">GRAND TOTAL</td>
                                <td className="py-6 text-right font-black text-3xl text-blue-700 bg-gray-50 px-4">৳{parseFloat(selectedOrder.total_amount).toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>

                    {selectedOrder.note && (
                        <div className="mb-12 p-6 bg-gray-50 border-l-4 border-gray-900">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Memo Note:</h4>
                            <p className="text-sm italic text-gray-700">"{selectedOrder.note}"</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-20 mt-20 pt-20">
                        <div className="text-center border-t border-gray-400 pt-4">
                            <p className="font-black text-xs uppercase tracking-widest text-gray-500 mb-1">Prepared By (SR)</p>
                            <p className="font-bold text-gray-900 uppercase">{selectedOrder.sr_name}</p>
                        </div>
                        <div className="text-center border-t border-gray-400 pt-4">
                            <p className="font-black text-xs uppercase tracking-widest text-gray-500 mb-1">Authorized Manager Signature</p>
                            <p className="font-bold text-gray-900 uppercase">{selectedOrder.manager_name}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
