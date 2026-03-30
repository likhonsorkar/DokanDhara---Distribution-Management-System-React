import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { 
    Store, MapPin, Phone, User, Calendar, 
    ArrowLeft, ShoppingBag, Loader2, Printer,
    History, PlusCircle, ChevronRight, Clock,
    Package, TrendingUp, Info, Footprints, FileText,
    Edit3
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

const ShopDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visitLoading, setVisitLoading] = useState(false);
    const [selectedOrderForPrint, setSelectedOrderForPrint] = useState(null);
    const getAuthItem = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);
    const role = getAuthItem('role');

    useEffect(() => {
        const fetchShopData = async () => {
            try {
                const [shopRes, ordersRes] = await Promise.all([
                    api.get(`shops/${id}/`),
                    api.get(`shops/${id}/orders/`)
                ]);
                setShop(shopRes.data);
                setOrders(ordersRes.data.results || ordersRes.data);
            } catch (err) {
                console.error("Error fetching shop details:", err);
                alert("Could not load shop data.");
                navigate('/shops');
            } finally {
                setLoading(false);
            }
        };
        fetchShopData();
    }, [id, navigate]);

    const handleLogVisit = async () => {
        setVisitLoading(true);
        try {
            await api.post('visits/', { shop: id });
            alert("Visit logged successfully!");
        } catch (err) {
            alert(err.response?.data?.non_field_errors?.[0] || "Already visited today or error occurred.");
        } finally {
            setVisitLoading(false);
        }
    };

    const handlePrint = async (orderId) => {
        try {
            const res = await api.get(`orders/${orderId}/invoice/`);
            setSelectedOrderForPrint(res.data);
            setTimeout(() => {
                window.print();
            }, 500);
        } catch (err) {
            console.error("Print error:", err);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
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

            {/* Header & Back Button */}
            <div className="flex items-center gap-4 no-print">
                <button onClick={() => navigate('/shops')} className="p-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-blue-600 transition">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{shop.shop_name}</h1>
                    <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                        <MapPin size={12} className="mr-1 text-blue-500" /> {shop.route_name} Route
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
                {/* Shop Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-blue-600 p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Retailer Contact</p>
                                <h3 className="text-2xl font-bold mb-1 uppercase">{shop.shop_name}</h3>
                                <div className="flex items-center gap-2 text-blue-100 mt-4">
                                    <Phone size={16} />
                                    <span className="font-mono font-bold">{shop.contact_number || 'No Contact'}</span>
                                </div>
                            </div>
                            <Store className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Address</h4>
                                <p className="text-sm text-gray-600 font-medium italic">{shop.address || 'Address not listed'}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3">
                                <button 
                                    onClick={handleLogVisit}
                                    disabled={visitLoading}
                                    className="w-full py-4 bg-purple-50 text-purple-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-purple-600 hover:text-white transition flex items-center justify-center gap-2 border border-purple-100 shadow-sm"
                                >
                                    {visitLoading ? <Loader2 size={16} className="animate-spin" /> : <Footprints size={16} />}
                                    Record Shop Visit
                                </button>
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Assigned SR</h4>
                                    <p className="text-sm font-bold text-gray-900 uppercase">{shop.sr_name}</p>
                                </div>
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                    <User size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-blue-50 rounded-[32px] p-8 border border-blue-100">
                        <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <TrendingUp size={16} /> Business Summary
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-blue-50">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Orders</span>
                                <span className="font-black text-gray-900">{orders.length}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-blue-50">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivered</span>
                                <span className="font-black text-green-600">{orders.filter(o => o.status === 'delivered').length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                            <History className="text-blue-600" /> Transaction History
                        </h2>
                        {(role === 'sr' || role === 'shopkeeper') && (
                            <Link 
                                to="/createorder" 
                                state={{ shopId: shop.id, shopName: shop.shop_name }}
                                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                            >
                                <PlusCircle size={18} /> New Memo
                            </Link>
                        )}
                    </div>

                    <div className="space-y-4">
                        {orders.length === 0 ? (
                            <div className="bg-white p-20 rounded-[40px] border border-dashed border-gray-200 text-center">
                                <ShoppingBag className="mx-auto text-gray-200 mb-4" size={48} />
                                <p className="text-gray-400 font-medium italic">No distribution history yet</p>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-center justify-between gap-4 group">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-black text-blue-600">#{order.id}</span>
                                                <StatusBadge status={order.status} />
                                            </div>
                                            <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                <Calendar size={10} className="mr-1" /> {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Amount</p>
                                            <p className="text-lg font-black text-gray-900">৳{parseFloat(order.total_amount).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* SR Edit shortcut - Only Pending */}
                                            {role === 'sr' && order.status === 'pending' && (
                                                <button 
                                                    onClick={() => navigate('/createorder', { 
                                                        state: { 
                                                            shopId: shop.id, 
                                                            shopName: shop.shop_name,
                                                            editOrderId: order.id,
                                                            existingItems: order.items 
                                                        } 
                                                    })}
                                                    className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition"
                                                    title="Edit Items"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handlePrint(order.id)}
                                                className="p-2.5 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-xl transition"
                                                title="Print Memo"
                                            >
                                                <Printer size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Print View Component (Reused) */}
            {selectedOrderForPrint && (
                <div className="print-only w-full bg-white p-10 font-sans">
                    <div className="flex justify-between items-start border-b-2 border-gray-900 pb-8 mb-8">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">DOKANDHARA</h1>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center">Enterprise Distribution Management</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-black text-gray-900 mb-1 uppercase">DISTRIBUTION MEMO</h2>
                            <p className="text-sm font-bold text-gray-600">INVOICE NO: #{selectedOrderForPrint.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div>
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">BILL TO (RETAILER)</h4>
                            <p className="text-2xl font-black text-gray-900 mb-1 uppercase">{selectedOrderForPrint.shop_name}</p>
                            <p className="text-md text-gray-600 mb-1">{selectedOrderForPrint.shop_address}</p>
                            <p className="text-md font-bold text-gray-900">Route: {selectedOrderForPrint.route_name}</p>
                        </div>
                        <div className="text-right">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">DISTRIBUTION DETAILS</h4>
                            <div className="space-y-2">
                                <p className="text-md"><span className="text-gray-400 font-bold uppercase text-[10px] mr-2">Assigned SR:</span> <span className="font-bold uppercase">{selectedOrderForPrint.sr_name}</span></p>
                                <p className="text-md"><span className="text-gray-400 font-bold uppercase text-[10px] mr-2">Contact SR:</span> <span className="font-bold">{selectedOrderForPrint.sr_phone || 'N/A'}</span></p>
                                <p className="text-md"><span className="text-gray-400 font-bold uppercase text-[10px] mr-2">Date Created:</span> <span className="font-bold">{new Date(selectedOrderForPrint.created_at).toLocaleDateString()}</span></p>
                                <p className="text-md"><span className="text-gray-400 font-bold uppercase text-[10px] mr-2">Status:</span> <span className="font-black uppercase text-blue-600">{selectedOrderForPrint.status}</span></p>
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
                            {selectedOrderForPrint.items?.map((item, idx) => (
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
                                <td className="py-6 text-right font-black text-3xl text-blue-700 bg-gray-50 px-4">৳{parseFloat(selectedOrderForPrint.total_amount).toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ShopDetails;
