import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ShopList from "../pages/ShopList";
import ShopDetails from "../pages/ShopDetails";
import Dashboard from "../pages/Dashboard";
import CreateOrder from "../pages/CreateOrder";
import OrderHistory from "../pages/OrderHistory";
import Inventory from "../pages/Inventory";
import PendingOrders from "../pages/PendingOrders";
import RouteManagement from "../pages/RouteManagement";
import Navbar from "../components/Navbar";

const ProtectedRoute = ({ children, roles }) => {
    const getAuthItem = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);
    const token = getAuthItem('access_token');
    const userRole = getAuthItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 antialiased">
                <Navbar />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/shops" element={
                            <ProtectedRoute roles={['admin', 'manager', 'sr', 'shopkeeper']}>
                                <ShopList />
                            </ProtectedRoute>
                        } />

                        <Route path="/shops/:id" element={
                            <ProtectedRoute roles={['admin', 'manager', 'sr', 'shopkeeper']}>
                                <ShopDetails />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/createorder" element={
                            <ProtectedRoute roles={['admin', 'manager', 'sr', 'shopkeeper']}>
                                <CreateOrder />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/history" element={
                            <ProtectedRoute>
                                <OrderHistory />
                            </ProtectedRoute>
                        } />

                        <Route path="/pending-orders" element={
                            <ProtectedRoute roles={['admin', 'manager', 'sr']}>
                                <PendingOrders />
                            </ProtectedRoute>
                        } />

                        <Route path="/inventory" element={
                            <ProtectedRoute roles={['admin', 'manager']}>
                                <Inventory />
                            </ProtectedRoute>
                        } />

                        <Route path="/routes" element={
                            <ProtectedRoute roles={['admin', 'manager']}>
                                <RouteManagement />
                            </ProtectedRoute>
                        } />
                        
                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <footer className="bg-white border-t border-gray-100 py-8 text-center no-print">
                    <p className="text-gray-400 text-sm font-medium">
                        &copy; {new Date().getFullYear()} DokanDhara DMS. All rights reserved.
                    </p>
                    <p className="text-[10px] text-gray-300 uppercase tracking-widest mt-2 font-bold">
                        Developed for MD. LIKHON SORKAR
                    </p>
                </footer>
            </div>
        </BrowserRouter>
    );
};

export default AppRoutes;
