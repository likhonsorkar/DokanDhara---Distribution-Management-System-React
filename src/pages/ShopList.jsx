import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
    Store, MapPin, Phone, ArrowRight, Search, 
    Loader2, ChevronRight, Footprints, CheckCircle2 
} from 'lucide-react';

const ShopList = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [visitLoading, setVisitLoading] = useState(null);
    const navigate = useNavigate();
    const getAuthItem = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);
    const role = getAuthItem('role');

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const res = await api.get('shops/');
                setShops(res.data.results || res.data);
            } catch (err) {
                console.error("Error fetching shops:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    const handleLogVisit = async (shopId) => {
        setVisitLoading(shopId);
        try {
            await api.post('visits/', { shop: shopId });
            alert("Visit logged successfully!");
        } catch (err) {
            alert(err.response?.data?.non_field_errors?.[0] || "Already visited today or error occurred.");
        } finally {
            setVisitLoading(null);
        }
    };

    const filteredShops = shops.filter(shop => 
        shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.route_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Scanning your territory...</p>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Retailer Network</h1>
                    <p className="text-gray-500 mt-1 italic font-medium">Manage shops and capture new distribution memos</p>
                </div>
                
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search shop or route..."
                        className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full md:w-80 transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredShops.length === 0 ? (
                <div className="bg-white p-20 rounded-[40px] border border-dashed border-gray-200 text-center">
                    <Store className="mx-auto text-gray-200 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-gray-900 italic">No shops found</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredShops.map(shop => (
                        <div key={shop.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group overflow-hidden">
                            <div className="p-8 pb-4">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-blue-50 rounded-[20px] text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Store size={28} />
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/shops/${shop.id}`)}
                                        className="p-2 text-gray-300 hover:text-blue-600 transition"
                                        title="View History"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                                
                                <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight truncate">{shop.shop_name}</h3>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-500 font-medium">
                                        <MapPin size={16} className="mr-2 text-blue-500" />
                                        {shop.route_name} Route
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 font-medium">
                                        <Phone size={16} className="mr-2 text-gray-400" />
                                        {shop.contact_number || 'No Contact'}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="px-8 pb-8 pt-4 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => handleLogVisit(shop.id)}
                                        disabled={visitLoading === shop.id}
                                        className="w-full py-3.5 bg-purple-50 text-purple-600 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition flex items-center justify-center gap-2"
                                    >
                                        {visitLoading === shop.id ? <Loader2 size={14} className="animate-spin" /> : <Footprints size={14} />} 
                                        Log Visit
                                    </button>
                                    <button 
                                        onClick={() => navigate(`/shops/${shop.id}`)}
                                        className="w-full py-3.5 bg-gray-50 text-gray-600 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition"
                                    >
                                        Archives
                                    </button>
                                </div>
                                {(role === 'sr' || role === 'shopkeeper') && (
                                    <button 
                                        onClick={() => navigate('/createorder', { state: { shopId: shop.id, shopName: shop.shop_name } })}
                                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition flex items-center justify-center gap-2"
                                    >
                                        New Memo Entry <ArrowRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShopList;
