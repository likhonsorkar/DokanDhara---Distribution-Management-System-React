import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
    Package, Search, Loader2, AlertTriangle, 
    Plus, MoreVertical, TrendingDown, X,
    Layers, Tag, DollarSign, List, Image as ImageIcon,
    CheckCircle2
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

// --- Modals ---

const ProductModal = ({ isOpen, onClose, onSuccess, categories, subCategories }) => {
    const [formData, setProductData] = useState({
        name: '', category: '', sku: '', base_unit: 'piece', 
        unit_sell_price: '', pack_sell_price: '', unit_cost_price: '', low_stock_threshold: 10,
        is_pack_available: false, pcs_per_pack: 1,
        thumbnail: null
    });
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const unitOptions = ['piece', 'kg', 'packet', 'litre', 'gram', 'box', 'cartoon', 'dozen'];

    const filteredSubCategories = subCategories.filter(
        sc => sc.main_category === parseInt(selectedCategoryId)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'thumbnail') {
                if (formData.thumbnail) data.append('thumbnail', formData.thumbnail);
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            await api.post('products/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error creating product. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="text-blue-600" /> Add New Product
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition text-gray-400"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">Product Name</label>
                            <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition" 
                                value={formData.name} onChange={e => setProductData({...formData, name: e.target.value})} placeholder="e.g. Fresh Milk 1L"/>
                        </div>
                        
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">Main Category</label>
                            <select required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition capitalize"
                                value={selectedCategoryId} onChange={e => setSelectedCategoryId(e.target.value)}>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">Sub Category</label>
                            <select required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition capitalize"
                                value={formData.category} onChange={e => setProductData({...formData, category: e.target.value})}
                                disabled={!selectedCategoryId}>
                                <option value="">Select Sub-Category</option>
                                {filteredSubCategories.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">SKU Code</label>
                            <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition"
                                value={formData.sku} onChange={e => setProductData({...formData, sku: e.target.value})} placeholder="MILK-001"/>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">Unit Price (Sell)</label>
                            <input required type="number" step="0.01" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition"
                                value={formData.unit_sell_price} onChange={e => setProductData({...formData, unit_sell_price: e.target.value})} placeholder="0.00"/>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">Base Unit</label>
                            <select required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition capitalize"
                                value={formData.base_unit} onChange={e => setProductData({...formData, base_unit: e.target.value})}>
                                {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">Low Stock Alert</label>
                            <input required type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition"
                                value={formData.low_stock_threshold} onChange={e => setProductData({...formData, low_stock_threshold: e.target.value})} />
                        </div>

                        <div className="col-span-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-900">Pack Distribution</p>
                                <p className="text-[10px] text-gray-500 uppercase font-medium">Enable pack-wise ordering for this product</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" 
                                    checked={formData.is_pack_available}
                                    onChange={e => setProductData({...formData, is_pack_available: e.target.checked})}/>
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {formData.is_pack_available && (
                            <>
                                <div className="animate-in slide-in-from-top-2 duration-200">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">Pieces per Pack</label>
                                    <input required type="number" className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition"
                                        value={formData.pcs_per_pack} onChange={e => setProductData({...formData, pcs_per_pack: e.target.value})} placeholder="e.g. 12"/>
                                </div>
                                <div className="animate-in slide-in-from-top-2 duration-200">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">Pack Selling Price</label>
                                    <input required type="number" step="0.01" className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition"
                                        value={formData.pack_sell_price} onChange={e => setProductData({...formData, pack_sell_price: e.target.value})} placeholder="0.00"/>
                                </div>
                            </>
                        )}

                        <div className="col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">Product Image</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-blue-400 transition bg-gray-50/30">
                                <div className="space-y-1 text-center">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input type="file" className="sr-only" accept="image/*"
                                                onChange={e => setProductData({...formData, thumbnail: e.target.files[0]})} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                                    {formData.thumbnail && <p className="text-xs font-bold text-green-600 mt-2 flex items-center justify-center gap-1"><CheckCircle2 size={14}/> {formData.thumbnail.name}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button disabled={loading} type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition disabled:bg-gray-400">
                        {loading ? 'Saving Product...' : 'Register Product Engine'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const BatchModal = ({ isOpen, onClose, onSuccess, products }) => {
    const [formData, setBatchData] = useState({
        product: '', received_qty: '', cost_price: '', sell_price: ''
    });
    const [entryMode, setEntryMode] = useState('piece'); // 'piece' or 'pack'
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const selectedProduct = products.find(p => p.id === parseInt(formData.product));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        let finalData = { 
            product: parseInt(formData.product),
            received_qty: parseInt(formData.received_qty),
            cost_price: parseFloat(formData.cost_price),
            sell_price: parseFloat(formData.sell_price)
        };

        if (entryMode === 'pack' && selectedProduct) {
            finalData.received_qty = finalData.received_qty * selectedProduct.pcs_per_pack;
            finalData.cost_price = finalData.cost_price / selectedProduct.pcs_per_pack;
            finalData.sell_price = finalData.sell_price / selectedProduct.pcs_per_pack;
        }

        try {
            await api.post('batches/', finalData);
            onSuccess();
            onClose();
            // Reset form
            setBatchData({ product: '', received_qty: '', cost_price: '', sell_price: '' });
        } catch (err) {
            console.error(err);
            alert("Error adding stock. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Layers className="text-purple-600" /> Add Stock Batch
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition text-gray-400"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">Select Product</label>
                        <select required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition"
                            value={formData.product} onChange={e => setBatchData({...formData, product: e.target.value})}>
                            <option value="">Select Product</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.stock_quantity} in stock)</option>)}
                        </select>
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button type="button" onClick={() => setEntryMode('piece')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition ${entryMode === 'piece' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}>By Piece</button>
                        <button type="button" onClick={() => setEntryMode('pack')} disabled={!selectedProduct?.is_pack_available} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition disabled:opacity-30 ${entryMode === 'pack' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}>By Pack</button>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">
                            Received Quantity ({entryMode === 'piece' ? 'Pcs' : 'Packs'})
                        </label>
                        <input required type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition"
                            value={formData.received_qty} onChange={e => setBatchData({...formData, received_qty: e.target.value})} placeholder={entryMode === 'piece' ? "e.g. 100" : "e.g. 5"}/>
                        {entryMode === 'pack' && selectedProduct && (
                            <p className="mt-1 ml-1 text-[10px] font-bold text-purple-600 uppercase">Total: {formData.received_qty * selectedProduct.pcs_per_pack} Pieces</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">Cost Price ({entryMode === 'piece' ? 'Unit' : 'Pack'})</label>
                            <input required type="number" step="0.01" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition"
                                value={formData.cost_price} onChange={e => setBatchData({...formData, cost_price: e.target.value})} placeholder="0.00"/>
                        </div>
                        <div className="relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">Sell Price ({entryMode === 'piece' ? 'Unit' : 'Pack'})</label>
                            <input required type="number" step="0.01" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition"
                                value={formData.sell_price} onChange={e => setBatchData({...formData, sell_price: e.target.value})} placeholder="0.00"/>
                            {selectedProduct && (
                                <button type="button" onClick={() => setBatchData({...formData, sell_price: entryMode === 'piece' ? selectedProduct.unit_sell_price : selectedProduct.pack_sell_price})} className="absolute -bottom-5 right-1 text-[8px] font-black text-purple-500 uppercase hover:underline">Use Current Rate</button>
                            )}
                        </div>
                    </div>
                    <button disabled={loading} type="submit" className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition disabled:bg-gray-400">
                        {loading ? 'Processing...' : 'Add Stock Batch'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Main Inventory Component ---

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); 
    const [expandedProduct, setExpandedProduct] = useState(null);
    
    const [isProductModalOpen, setProductModalOpen] = useState(false);
    const [isBatchModalOpen, setBatchModalOpen] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('filter') === 'low_stock') {
            setFilterType('low_stock');
        }
        fetchData();
    }, [location]);

    const fetchData = async () => {
        try {
            const [prodRes, catRes, subCatRes] = await Promise.all([
                api.get('products/'),
                api.get('categories/'),
                api.get('subcategories/')
            ]);
            setProducts(prodRes.data.results || prodRes.data);
            setCategories(catRes.data.results || catRes.data);
            setSubCategories(subCatRes.data.results || subCatRes.data);
        } catch (err) {
            console.error("Error fetching inventory data:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filterType === 'low_stock') {
            return matchesSearch && product.stock_quantity <= product.low_stock_threshold;
        }
        return matchesSearch;
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading inventory...</p>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Inventory Engine</h1>
                    <p className="text-gray-500 mt-1 italic font-medium text-sm">Real-time stock monitoring & FIFO batch management</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Search size={18} />
                        </div>
                        <input 
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full md:w-64 transition bg-white shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setBatchModalOpen(true)}
                        className="bg-purple-600 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-purple-100 hover:bg-purple-700 transition flex items-center gap-2 text-sm font-bold"
                    >
                        <Layers size={18} /> Add Stock
                    </button>
                    <button 
                        onClick={() => setProductModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition flex items-center gap-2 text-sm font-bold"
                    >
                        <Plus size={18} /> New Product
                    </button>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm w-fit">
                <button 
                    onClick={() => setFilterType('all')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition ${filterType === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    All Items ({products.length})
                </button>
                <button 
                    onClick={() => setFilterType('low_stock')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition ${filterType === 'low_stock' ? 'bg-red-500 text-white shadow-md' : 'text-red-500 hover:bg-red-50'}`}
                >
                    <TrendingDown size={16} />
                    Low Stock ({products.filter(p => p.stock_quantity <= p.low_stock_threshold).length})
                </button>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Product Info</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">In Stock</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Unit Price</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Cost (Latest)</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <Package className="h-12 w-12 text-gray-200 mb-4" />
                                            <p className="text-gray-500 font-medium italic">No products matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map(product => (
                                    <React.Fragment key={product.id}>
                                        <tr 
                                            onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                                            className="hover:bg-blue-50/20 transition group cursor-pointer"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-white transition border border-gray-100 shadow-sm overflow-hidden">
                                                        {product.thumbnail ? (
                                                            <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package className="text-gray-400" size={24} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 group-hover:text-blue-600 transition">{product.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-mono">SKU: {product.sku || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <p className={`text-sm font-black ${product.stock_quantity <= product.low_stock_threshold ? 'text-red-500' : 'text-gray-900'}`}>
                                                    {product.stock_quantity}
                                                </p>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">{product.base_unit}</p>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <p className="text-sm font-black text-gray-900">৳{parseFloat(product.unit_sell_price).toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">Sell Price</p>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <p className="text-sm font-bold text-gray-500 italic">৳{parseFloat(product.unit_cost_price || 0).toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Cost Price</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                                                    {product.category_name || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                {product.stock_quantity <= product.low_stock_threshold ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-100 uppercase tracking-widest animate-pulse">
                                                        <AlertTriangle size={12} className="mr-1" /> Low Stock
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-100 uppercase tracking-widest">
                                                        In Stock
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 transition">
                                                    <MoreVertical size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedProduct === product.id && (
                                            <tr className="bg-gray-50/50">
                                                <td colSpan="7" className="px-12 py-6">
                                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-inner overflow-hidden animate-in slide-in-from-top-2 duration-200">
                                                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center justify-between">
                                                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Active Stock Batches (FIFO Order)</h5>
                                                            <Layers size={14} className="text-gray-300" />
                                                        </div>
                                                        <table className="w-full text-left text-xs">
                                                            <thead>
                                                                <tr className="text-gray-400 border-b border-gray-50">
                                                                    <th className="px-6 py-3 font-bold uppercase tracking-widest">Batch Number</th>
                                                                    <th className="px-6 py-3 font-bold uppercase tracking-widest">Received Date</th>
                                                                    <th className="px-6 py-3 font-bold uppercase tracking-widest text-center">Remaining</th>
                                                                    <th className="px-6 py-3 font-bold uppercase tracking-widest text-right">Unit Rate</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-50">
                                                                {product.active_batches?.map(batch => (
                                                                    <tr key={batch.batch_number} className="hover:bg-blue-50/30 transition">
                                                                        <td className="px-6 py-4 font-mono font-bold text-blue-600">{batch.batch_number}</td>
                                                                        <td className="px-6 py-4 text-gray-500">{new Date(batch.created_at).toLocaleDateString()}</td>
                                                                        <td className="px-6 py-4 text-center">
                                                                            <span className="font-black text-gray-900">{batch.remaining_qty}</span>
                                                                            <span className="ml-1 text-[10px] text-gray-400 uppercase font-bold">{product.base_unit}</span>
                                                                        </td>
                                                                        <td className="px-6 py-4 text-right font-black text-gray-900">৳{parseFloat(batch.sell_price).toLocaleString()}</td>
                                                                    </tr>
                                                                ))}
                                                                {(!product.active_batches || product.active_batches.length === 0) && (
                                                                    <tr>
                                                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic font-medium">No active batches available for this product</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <ProductModal 
                isOpen={isProductModalOpen} 
                onClose={() => setProductModalOpen(false)} 
                onSuccess={fetchData}
                categories={categories}
                subCategories={subCategories}
            />
            <BatchModal 
                isOpen={isBatchModalOpen} 
                onClose={() => setBatchModalOpen(false)} 
                onSuccess={fetchData}
                products={products}
            />
        </div>
    );
};

export default Inventory;
