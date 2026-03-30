import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
    ShoppingCart, Plus, Minus, Trash2, Search, 
    ArrowLeft, Package, CheckCircle2, Loader2,
    Layers, Box, Save
} from 'lucide-react';

const CreateOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { shopId, shopName, editOrderId, existingItems } = location.state || {};

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!shopId) {
            navigate('/shops');
            return;
        }
        
        const fetchData = async () => {
            try {
                const res = await api.get('products/');
                const allProducts = res.data.results || res.data;
                setProducts(allProducts);

                // If in Edit Mode, populate cart
                if (editOrderId && existingItems) {
                    const initialCart = existingItems.map(item => {
                        const productData = allProducts.find(p => p.id === item.product);
                        return {
                            product: item.product,
                            name: item.product_name,
                            quantity: item.quantity,
                            price: parseFloat(item.unit_price),
                            unit: item.product_unit,
                            pcs_per_pack: productData?.pcs_per_pack || 1,
                            is_pack_available: productData?.is_pack_available || false
                        };
                    });
                    setCart(initialCart);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [shopId, navigate, editOrderId, existingItems]);

    const addToCart = (product, mode = 'pcs') => {
        const exist = cart.find(item => item.product === product.id);
        const qtyToAdd = mode === 'pack' ? (product.pcs_per_pack || 1) : 1;
        
        // Calculate pack discount if applicable
        const pieceWisePackPrice = parseFloat(product.unit_sell_price) * (product.pcs_per_pack || 1);
        const packDiscountPerPack = (product.is_pack_available && product.pack_sell_price > 0) 
            ? Math.max(0, pieceWisePackPrice - parseFloat(product.pack_sell_price)) 
            : 0;
        
        const addedDiscount = mode === 'pack' ? packDiscountPerPack : 0;

        if (exist) {
            setCart(cart.map(item => item.product === product.id ? { 
                ...exist, 
                quantity: exist.quantity + qtyToAdd,
                discount: (exist.discount || 0) + addedDiscount
            } : item));
        } else {
            setCart([...cart, { 
                product: product.id, 
                name: product.name, 
                quantity: qtyToAdd, 
                price: parseFloat(product.unit_sell_price),
                discount: addedDiscount,
                unit: product.base_unit,
                pcs_per_pack: product.pcs_per_pack || 1,
                is_pack_available: product.is_pack_available,
                pack_sell_price: product.pack_sell_price
            }]);
        }
    };

    const updateQty = (id, delta, mode = 'pcs') => {
        const item = cart.find(i => i.product === id);
        if (!item) return;
        
        const qtyDelta = mode === 'pack' ? (item.pcs_per_pack * delta) : delta;
        const newQty = Math.max(1, item.quantity + qtyDelta);
        
        // Recalculate discount based on total packs
        let newDiscount = 0;
        if (item.is_pack_available && item.pack_sell_price > 0) {
            const numPacks = Math.floor(newQty / item.pcs_per_pack);
            const pieceWisePackPrice = item.price * item.pcs_per_pack;
            const discountPerPack = Math.max(0, pieceWisePackPrice - parseFloat(item.pack_sell_price));
            newDiscount = numPacks * discountPerPack;
        }

        setCart(cart.map(i => i.product === id ? { ...i, quantity: newQty, discount: newDiscount } : i));
    };

    const removeFromCart = (id) => setCart(cart.filter(item => item.product !== id));

    const totalBill = cart.reduce((sum, item) => sum + (item.price * item.quantity) - (item.discount || 0), 0);

    const handleOrderSubmit = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            const orderItems = cart.map(item => ({
                product: item.product,
                quantity: item.quantity,
                discount: item.discount || 0
            }));
            
            if (editOrderId) {
                await api.patch(`orders/${editOrderId}/`, { items: orderItems });
                alert("Order updated successfully!");
            } else {
                await api.post(`shops/${shopId}/orders/`, { items: orderItems });
                alert("Order placed successfully!");
            }
            navigate('/history');
        } catch (err) {
            alert(err.response?.data?.detail || err.response?.data?.error || "Error processing order!");
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (fetching) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
            {/* Products Side */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-xl transition text-gray-500 hover:text-blue-600">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">{shopName}</h2>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                            {editOrderId ? `Edit Distribution Memo #${editOrderId}` : 'Fresh Order Entry'}
                        </p>
                    </div>
                    <div className="w-10"></div>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input 
                        type="text"
                        placeholder="Quick search products..."
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-6">
                        {filteredProducts.map(p => (
                            <div key={p.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition group flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-blue-50 p-3 rounded-2xl">
                                        <Package className="text-blue-600" size={20} />
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${p.stock_quantity > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {p.stock_quantity > 0 ? `Stock: ${p.stock_quantity} ${p.base_unit}` : 'Out of Stock'}
                                        </span>
                                        {p.is_pack_available && (
                                            <p className="text-[8px] text-gray-400 font-bold uppercase mt-1">{p.pcs_per_pack} pcs / Pack</p>
                                        )}
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1 flex-1 uppercase text-sm leading-tight">{p.name}</h4>
                                <p className="text-blue-600 font-black text-xl mb-4">৳{parseFloat(p.unit_sell_price).toLocaleString()} <span className="text-[10px] text-gray-400 font-normal uppercase">/ {p.base_unit}</span></p>
                                
                                <div className="grid grid-cols-2 gap-2 mt-auto">
                                    <button 
                                        onClick={() => addToCart(p, 'pcs')}
                                        disabled={p.stock_quantity <= 0}
                                        className="py-2.5 rounded-xl font-bold text-[10px] uppercase bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition flex items-center justify-center gap-1"
                                    >
                                        <Plus size={12}/> Piece
                                    </button>
                                    <button 
                                        onClick={() => addToCart(p, 'pack')}
                                        disabled={p.stock_quantity < (p.pcs_per_pack || 1) || !p.is_pack_available}
                                        className="py-2.5 rounded-xl font-bold text-[10px] uppercase bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white disabled:opacity-50 transition flex items-center justify-center gap-1"
                                    >
                                        <Layers size={12}/> Pack
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart Side */}
            <div className="w-full lg:w-[400px] bg-white border-l border-gray-100 flex flex-col shadow-2xl z-10">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-blue-600 text-white">
                    <div className="flex items-center">
                        <ShoppingCart className="mr-3" />
                        <h2 className="text-lg font-bold">Checkout List</h2>
                    </div>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                        {cart.length} Items
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                            <div className="bg-gray-50 p-8 rounded-full">
                                <ShoppingCart size={48} strokeWidth={1} />
                            </div>
                            <p className="text-sm font-medium italic">Your cart is empty</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.product} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 animate-in fade-in slide-in-from-right-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 truncate uppercase text-sm">{item.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Rate: ৳{item.price}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.product)} className="p-1.5 text-gray-300 hover:text-red-500 transition"><Trash2 size={16}/></button>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {/* Pieces Control */}
                                        <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                                            <button onClick={() => updateQty(item.product, -1, 'pcs')} className="p-1 hover:text-blue-600 transition"><Minus size={12}/></button>
                                            <div className="px-2 text-center min-w-[30px]">
                                                <p className="text-[10px] font-black text-gray-900">{item.quantity}</p>
                                                <p className="text-[8px] text-gray-400 uppercase font-bold">{item.unit}</p>
                                            </div>
                                            <button onClick={() => updateQty(item.product, 1, 'pcs')} className="p-1 hover:text-blue-600 transition"><Plus size={12}/></button>
                                        </div>

                                        {/* Packs Shortcut */}
                                        {item.is_pack_available && (
                                            <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                                                <button onClick={() => updateQty(item.product, -1, 'pack')} className="p-1 hover:text-purple-600 transition"><Minus size={12}/></button>
                                                <div className="px-2 text-center min-w-[30px]">
                                                    <p className="text-[10px] font-black text-purple-600">{Math.floor(item.quantity / item.pcs_per_pack)}</p>
                                                    <p className="text-[8px] text-gray-400 uppercase font-bold">Packs</p>
                                                </div>
                                                <button onClick={() => updateQty(item.product, 1, 'pack')} className="p-1 hover:text-purple-600 transition"><Plus size={12}/></button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Amount</p>
                                        <p className="text-sm font-black text-gray-900">৳{((item.price * item.quantity) - (item.discount || 0)).toLocaleString()}</p>
                                        {item.discount > 0 && (
                                            <p className="text-[10px] text-green-600 font-bold uppercase tracking-tighter animate-pulse">
                                                -৳{item.discount.toLocaleString()} Off
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Total Payable</span>
                        <span className="text-3xl font-black text-gray-900">৳{totalBill.toLocaleString()}</span>
                    </div>
                    <button 
                        onClick={handleOrderSubmit}
                        disabled={loading || cart.length === 0}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-300 disabled:shadow-none transition flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                {editOrderId ? <Save size={20} /> : <CheckCircle2 size={20} />}
                                <span className="uppercase tracking-widest text-sm">{editOrderId ? 'Update Order Items' : 'Confirm Distribution'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateOrder;
