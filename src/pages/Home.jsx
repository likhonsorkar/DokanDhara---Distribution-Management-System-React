import React from 'react';
import { Link } from 'react-router-dom';
import { 
    ShoppingCart, Package, BarChart3, Truck, ArrowRight, 
    ShieldCheck, Globe, Zap, CheckCircle2, LayoutDashboard,
    Users, Briefcase, Store, MapPin
} from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-white selection:bg-blue-100">
            {/* Navigation / Hero Top */}
            <div className="relative overflow-hidden bg-slate-900 pt-16 pb-24 lg:pt-32 lg:pb-40">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center lg:text-left">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                        <div className="lg:col-span-7">
                            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
                                <Zap size={14} className="fill-current" />
                                <span className="text-[10px] font-black uppercase tracking-widest">v2.0 Performance Engine</span>
                            </div>
                            
                            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-8 uppercase tracking-tighter">
                                Distribution <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                    Simplified.
                                </span>
                            </h1>
                            
                            <p className="text-lg lg:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed font-medium">
                                DokanDhara is the enterprise-grade distribution management system built for the next generation of logistics. Empowering <strong>MD. LIKHON SORKAR</strong> with real-time FIFO stock tracking, route optimization, and swift memo generation.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/login"
                                    className="px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center group"
                                >
                                    Launch Dashboard
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button className="px-10 py-5 bg-slate-800 text-slate-300 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-700 transition-all border border-slate-700">
                                    Network Overview
                                </button>
                            </div>

                            <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 opacity-40">
                                <div className="flex items-center text-slate-400 font-black text-[10px] uppercase tracking-widest">
                                    <ShieldCheck className="mr-2" size={16} /> Secure JWT
                                </div>
                                <div className="flex items-center text-slate-400 font-black text-[10px] uppercase tracking-widest">
                                    <Globe className="mr-2" size={16} /> Cloud Sync
                                </div>
                                <div className="flex items-center text-slate-400 font-black text-[10px] uppercase tracking-widest">
                                    <Zap className="mr-2" size={16} /> FIFO Logic
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 mt-16 lg:mt-0 relative">
                            <div className="relative rounded-[40px] bg-slate-800/50 border border-slate-700 p-8 backdrop-blur-xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 group">
                                <div className="absolute -top-4 -right-4 bg-blue-500 p-4 rounded-3xl shadow-xl animate-bounce">
                                    <LayoutDashboard className="text-white" size={24} />
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center text-blue-400">
                                            <Package size={24} />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-2 w-24 bg-slate-600 rounded"></div>
                                            <div className="h-2 w-32 bg-slate-700 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-700 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Today's Sales</span>
                                            <span className="text-sm font-black text-green-400">৳ 84,200</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-blue-500 h-full w-2/3"></div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-center">
                                            <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Stock</p>
                                            <p className="text-lg font-black text-white">92%</p>
                                        </div>
                                        <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-center">
                                            <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-1">Memos</p>
                                            <p className="text-lg font-black text-white">42</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Solutions Section */}
            <div className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-4">The Infrastructure</h2>
                        <p className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                            A complete suite for <br />
                            <span className="text-slate-400 italic font-serif lowercase">modern</span> distribution.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-10 bg-slate-50 rounded-[40px] hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all group">
                            <div className="w-16 h-16 bg-blue-600 rounded-[20px] flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
                                <Package size={28} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">Inventory Engine</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                Multi-rate stock batches with strict FIFO enforcement. Track pieces, packs, and cartons with 100% accuracy.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-10 bg-slate-50 rounded-[40px] hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all group border-2 border-transparent hover:border-blue-50">
                            <div className="w-16 h-16 bg-slate-900 rounded-[20px] flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-slate-200">
                                <Truck size={28} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">Territory Mapping</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                Organize your shops into efficient routes. Assign Sales Representatives (SR) to specific territories for optimized coverage.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-10 bg-slate-50 rounded-[40px] hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all group">
                            <div className="w-16 h-16 bg-purple-600 rounded-[20px] flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-purple-200">
                                <BarChart3 size={28} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">Performance Insights</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                Comprehensive dashboards for Managers, SRs, and Retailers. Visual stats for sales, stock, and visits.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How it Works / Stats */}
            <div className="bg-slate-900 py-24 rounded-[60px] mx-6 mb-12 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-12">
                            Engineered for <br />
                            High-Volume Commerce
                        </h2>
                        
                        <div className="space-y-8">
                            {[
                                { icon: <Users size={20} />, title: "SR-Focussed Workflow", desc: "Native mobile experience for field agents to capture memos on the go." },
                                { icon: <Store size={20} />, title: "Retailer Integration", desc: "Dedicated portal for shop owners to track their order history and dues." },
                                { icon: <Briefcase size={20} />, title: "Manager Control", desc: "Batch confirmation, dispatch tracking, and delivery validation tools." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase text-sm tracking-widest mb-2">{item.title}</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>
                        <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-sm text-center">
                            <p className="text-4xl font-black text-white mb-2 leading-none">100%</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">FIFO Accuracy</p>
                        </div>
                        <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-sm text-center mt-12">
                            <p className="text-4xl font-black text-blue-400 mb-2 leading-none">0.2s</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Query Response</p>
                        </div>
                        <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-sm text-center">
                            <p className="text-4xl font-black text-purple-400 mb-2 leading-none">24/7</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stock Sync</p>
                        </div>
                        <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-sm text-center mt-12">
                            <p className="text-4xl font-black text-white mb-2 leading-none">AES</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data Encryption</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / CTA */}
            <div className="py-24 text-center">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">Ready to dominate your distribution territory?</h3>
                <Link
                    to="/login"
                    className="inline-flex items-center px-12 py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group"
                >
                    Secure Login
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="mt-12 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
                    Built for MD. LIKHON SORKAR • DokanDhara v2.0
                </p>
            </div>
        </div>
    );
};

export default Home;
