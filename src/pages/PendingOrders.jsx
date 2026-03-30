import React, { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { 
    Clock, Search, Loader2, CheckCircle2, XCircle, 
    Printer, ChevronRight, ShoppingBag, MapPin, 
    User, Calendar, FileText, ArrowLeft, MoreHorizontal,
    Truck, Package, Info, CheckCircle, Edit3, Store, AlertCircle
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

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

const PendingOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('pending'); // pending, confirmed, processing
    
    const getAuthItem = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);
    const role = getAuthItem('role');
    const location = useLocation();
    const navigate = useNavigate();

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
        const params = new URLSearchParams(location.search);
        const filter = params.get('filter');
        if (filter && ['pending', 'confirmed', 'processing'].includes(filter)) {
            setActiveTab(filter);
        }
        fetchOrders();
    }, [location]);

    const handleStatusUpdate = async (orderId, statusAction) => {
        setActionLoading(true);
        try {
            await api.post(`orders/${orderId}/${statusAction}/`);
            await fetchOrders();
            
            // Refresh detail view
            const updatedRes = await api.get(`orders/${orderId}/invoice/`);
            setSelectedOrder(updatedRes.data);
        } catch (err) {
            alert(err.response?.data?.detail || "Action failed");
        } finally {
            setActionLoading(false);
        }
    };

    const viewOrderDetails = async (order) => {
        try {
            const res = await api.get(`orders/${order.id}/invoice/`);
            setSelectedOrder(res.data);
        } catch (err) {
            console.error("Error fetching invoice:", err);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleEdit = (order) => {
        // Navigate to CreateOrder with edit mode and shop data
        navigate('/createorder', { 
            state: { 
                shopId: order.shop, 
                shopName: order.shop_name,
                editOrderId: order.id,
                existingItems: order.items 
            } 
        });
    };

    const filteredOrders = orders.filter(o => 
        o.status === activeTab && (
            o.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.id.toString().includes(searchTerm)
        )
    );

    const getTabCount = (status) => orders.filter(o => o.status === status).length;

    const isManager = role === 'manager' || role === 'admin';
    const isSR = role === 'sr';

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium italic">Scanning active distribution pipeline...</p>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 no-print">
            <style>
                {`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    @page { size: A4; margin: 1cm; }
                    body { background: white !important; }
                }
                .print-only { display: none; }
                `}
            </style>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Active Invoices</h1>
                    <p className="text-gray-500 mt-1 italic font-medium text-sm">Real-time lifecycle management of distribution memos</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Search size={18} />
                        </div>
                        <input 
                            type="text"
                            placeholder="Search Memo ID or Shop..."
                            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full md:w-64 transition bg-white shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex p-1.5 bg-gray-100 rounded-2xl w-fit">
                {[
                    { id: 'pending', label: 'New Pending', icon: Clock, color: 'text-orange-600' },
                    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle2, color: 'text-blue-600' },
                    { id: 'processing', label: 'On Dispatch', icon: Truck, color: 'text-purple-600' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setSelectedOrder(null);
                        }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? tab.color : ''} />
                        {tab.label}
                        <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-gray-100' : 'bg-gray-200/50'}`}>
                            {getTabCount(tab.id)}
                        </span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order List */}
                <div className="lg:col-span-1 space-y-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white p-10 rounded-3xl border border-dashed border-gray-200 text-center">
                            <ShoppingBag className="mx-auto text-gray-200 mb-2" size={40} />
                            <p className="text-gray-400 text-sm font-medium italic">No {activeTab} orders</p>
                        </div>
                    ) : (
                        filteredOrders.map(order => (
                            <div 
                                key={order.id}
                                onClick={() => viewOrderDetails(order)}
                                className={`bg-white p-5 rounded-3xl border transition cursor-pointer group relative overflow-hidden ${selectedOrder?.id === order.id ? 'border-blue-600 shadow-lg ring-1 ring-blue-600' : 'border-gray-100 hover:border-blue-300 shadow-sm'}`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-mono text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                                        ID #{order.id}
                                    </span>
                                    <StatusBadge status={order.status} />
                                </div>
                                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{order.shop_name}</h3>
                                <div className="flex items-center text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-widest">
                                    <MapPin size={10} className="mr-1" /> {order.route_name || 'N/A'}
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-sm font-black text-gray-900">৳{parseFloat(order.total_amount).toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Order Details / Action Area */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedOrder ? (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
                            {/* Detailed Header */}
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-bold text-gray-900">Distribution Memo #{selectedOrder.id}</h2>
                                        <StatusBadge status={selectedOrder.status} />
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium italic">Created on {new Date(selectedOrder.created_at).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Print Button - Everyone */}
                                    <button 
                                        onClick={handlePrint}
                                        className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-sm hover:bg-gray-50 transition shadow-sm"
                                    >
                                        <Printer size={16} /> Print
                                    </button>

                                    {/* SR Edit Button - Only Pending */}
                                    {isSR && selectedOrder.status === 'pending' && (
                                        <button 
                                            onClick={() => handleEdit(selectedOrder)}
                                            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-100 transition"
                                        >
                                            <Edit3 size={16} /> Edit Items
                                        </button>
                                    )}
                                    
                                    {/* Manager Action Buttons */}
                                    {isManager && selectedOrder.status === 'pending' && (
                                        <button 
                                            onClick={() => handleStatusUpdate(selectedOrder.id, 'confirm')}
                                            disabled={actionLoading}
                                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                                        >
                                            <CheckCircle2 size={16} /> Confirm Order
                                        </button>
                                    )}
                                    {isManager && selectedOrder.status === 'confirmed' && (
                                        <button 
                                            onClick={() => handleStatusUpdate(selectedOrder.id, 'processing')}
                                            disabled={actionLoading}
                                            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-700 transition shadow-lg shadow-purple-100"
                                        >
                                            <Truck size={16} /> Start Dispatch
                                        </button>
                                    )}
                                    {isManager && selectedOrder.status === 'processing' && (
                                        <button 
                                            onClick={() => handleStatusUpdate(selectedOrder.id, 'delivered')}
                                            disabled={actionLoading}
                                            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition shadow-lg shadow-green-100"
                                        >
                                            <CheckCircle size={16} /> Mark Delivered
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Details Content */}
                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                                            <Store className="mr-1" size={12} /> Retailer Info
                                        </h4>
                                        <p className="font-bold text-gray-900 text-lg uppercase">{selectedOrder.shop_name}</p>
                                        <p className="text-sm text-gray-500 mt-1 italic">{selectedOrder.shop_address || 'Address not available'}</p>
                                        <p className="text-xs font-bold text-blue-600 mt-2 flex items-center">
                                            <MapPin size={12} className="mr-1" /> Route: {selectedOrder.route_name || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-end">
                                            <User className="mr-1" size={12} /> Assigned SR
                                        </h4>
                                        <p className="font-bold text-gray-900 text-lg uppercase">{selectedOrder.sr_name}</p>
                                        <p className="text-sm text-gray-500 mt-1 font-mono">{selectedOrder.sr_phone || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Order Note */}
                                {selectedOrder.note && (
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center">
                                            <FileText className="mr-1" size={12} /> Memo Note
                                        </h4>
                                        <p className="text-sm text-gray-600 italic">"{selectedOrder.note}"</p>
                                    </div>
                                )}

                                {/* Items Table */}
                                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50/50 border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Description</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Rate</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Disc.</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {selectedOrder.items?.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50/30 transition">
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-sm text-gray-900 uppercase leading-tight">{item.product_name}</p>
                                                        <p className="text-[9px] text-gray-400 font-mono mt-0.5">SKU: {item.product_sku || 'N/A'}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="font-black text-sm text-gray-900">{item.quantity}</span>
                                                        <span className="text-[10px] text-gray-400 ml-1 uppercase font-bold">{item.product_unit || 'pcs'}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm text-gray-500 font-medium">৳{parseFloat(item.unit_price).toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-right text-sm text-green-600 font-bold">{item.discount > 0 ? `৳${parseFloat(item.discount).toLocaleString()}` : '-'}</td>
                                                    <td className="px-6 py-4 text-right font-black text-sm text-gray-900">৳{parseFloat(item.sub_total).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-blue-50/20 border-t border-blue-50">
                                            <tr>
                                                <td colSpan="3" className="px-6 py-5 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Grand Total Amount</td>
                                                <td className="px-6 py-5 text-right font-black text-xl text-blue-600">৳{parseFloat(selectedOrder.total_amount).toLocaleString()}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {/* Danger Zone / Cancellation - Manager OR SR (if pending/confirmed) */}
                                {(isManager || (isSR && ['pending', 'confirmed'].includes(selectedOrder.status))) && 
                                 selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                                    <div className="bg-red-50 p-5 rounded-2xl border border-red-100 flex items-center justify-between mt-4 animate-in slide-in-from-bottom-2">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2.5 rounded-xl text-red-500 shadow-sm border border-red-50">
                                                <AlertCircle size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-red-900 uppercase tracking-tight">Need to reject this memo?</p>
                                                <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider opacity-70">Stock will be returned to available inventory.</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                if(window.confirm("Reject this order memo?")) handleStatusUpdate(selectedOrder.id, 'cancel')
                                            }}
                                            disabled={actionLoading}
                                            className="px-5 py-2.5 bg-white text-red-600 rounded-xl border border-red-100 text-[10px] font-black hover:bg-red-600 hover:text-white transition shadow-sm uppercase tracking-widest"
                                        >
                                            Reject Memo
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-10 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="bg-gray-50 p-8 rounded-full mb-6">
                                <FileText className="text-gray-300 w-16 h-16" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Distribution Queue</h3>
                            <p className="text-gray-400 text-center max-w-xs text-sm font-medium italic">Select a {activeTab} memo from the list to view details and process fulfillment.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Print View Component */}
            {selectedOrder && (
                <div className="print-only w-full bg-white p-10 font-sans">
                    <div className="flex justify-between items-start border-b-2 border-gray-900 pb-8 mb-8">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">DOKANDHARA</h1>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Enterprise Distribution Management</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-black text-gray-900 mb-1 uppercase">DISTRIBUTION MEMO</h2>
                            <p className="text-sm font-bold text-gray-600">INVOICE NO: #{selectedOrder.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div>
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">BILL TO (RETAILER)</h4>
                            <p className="text-2xl font-black text-gray-900 mb-1 uppercase">{selectedOrder.shop_name}</p>
                            <p className="text-md text-gray-600 mb-1">{selectedOrder.shop_address}</p>
                            <p className="text-md font-bold text-gray-900">Route: {selectedOrder.route_name}</p>
                        </div>
                        <div className="text-right">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">DISTRIBUTION DETAILS</h4>
                            <div className="space-y-2">
                                <p className="text-md"><span className="text-gray-400 font-bold uppercase text-[10px] mr-2">Assigned SR:</span> <span className="font-bold">{selectedOrder.sr_name}</span></p>
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

export default PendingOrders;
