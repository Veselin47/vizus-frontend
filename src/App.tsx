import { Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { OpticPage } from './pages/OpticPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { BookingPage } from './pages/BookingPage';
import { RegisterPage } from './pages/RegisterPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderCancelPage } from './pages/OrderCancelPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminDoctorsPage } from './pages/admin/AdminDoctorsPage';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from './components/ui/ToastContainer';
import { Footer } from './components/layout/Footer';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AboutPage } from './pages/AboutPage';
import { DoctorDetailPage } from './pages/DoctorDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmAppointmentPage } from './pages/ConfirmAppointmentPage';


function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1"
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/optic" element={<OpticPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/order-cancel" element={<OrderCancelPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about/:id" element={<DoctorDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/appointments/confirm" element={<ConfirmAppointmentPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminCategoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDoctorsPage />
                </ProtectedRoute>
              } />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminAppointmentsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <Footer />
      <ToastContainer />

    </div>

  );
}

export default App;