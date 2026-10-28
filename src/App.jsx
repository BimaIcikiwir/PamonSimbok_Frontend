import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ShapeDefs from "./components/ornaments/ShapeDefs";
import CustomerLayout from "./layout/CustomerLayout";
import AdminLayout from "./layout/AdminLayout";

import HomePage from "./pages/customer/HomePage";
import MenuPage from "./pages/customer/MenuPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrderPage from "./pages/customer/OrderPage";
import TrackPage from "./pages/customer/TrackPage";

import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import OrdersPage from "./pages/admin/OrdersPage";
import PosPage from "./pages/admin/PosPage";
import MenuManagePage from "./pages/admin/MenuManagePage";
import NotFoundPage from "./pages/NotFoundPage";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <ShapeDefs />
            <Routes>
              {/* Pelanggan */}
              <Route element={<CustomerLayout />}>
                <Route index element={<HomePage />} />
                <Route path="menu" element={<MenuPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="pesanan/:code" element={<OrderPage />} />
                <Route path="lacak" element={<TrackPage />} />
              </Route>

              {/* Kasir & admin */}
              <Route path="kasir">
                <Route index element={<LoginPage />} />
                <Route element={<AdminLayout />}>
                  <Route path="dasbor" element={<DashboardPage />} />
                  <Route path="pesanan" element={<OrdersPage />} />
                  <Route path="buat-pesanan" element={<PosPage />} />
                  <Route path="menu" element={<MenuManagePage />} />
                  <Route path="*" element={<Navigate to="/kasir/dasbor" replace />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
