import { AnimatePresence } from 'framer-motion';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderPage from './pages/OrderPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import ProductEditPage from './pages/ProductEditPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import SellerRegisterPage from './pages/SellerRegisterPage';
import ShippingPage from './pages/ShippingPage';

import PageTransition from './components/PageTransition';
import AnimatedBackground from './components/AnimatedBackground';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/seller-register" element={<PageTransition><SellerRegisterPage /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductPage /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
        <Route path="/shipping" element={<PageTransition><ShippingPage /></PageTransition>} />
        <Route path="/payment" element={<PageTransition><PaymentPage /></PageTransition>} />
        <Route path="/placeorder" element={<PageTransition><PlaceOrderPage /></PageTransition>} />
        <Route path="/order/:id" element={<PageTransition><OrderPage /></PageTransition>} />
        <Route path="/myorders" element={<PageTransition><MyOrdersPage /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />

        <Route path="/dashboard" element={<PageTransition><SellerDashboardPage /></PageTransition>} />
        <Route path="/admin/dashboard" element={<PageTransition><AdminDashboardPage /></PageTransition>} />
        <Route path="/product/create" element={<PageTransition><ProductEditPage /></PageTransition>} />
        <Route path="/product/:id/edit" element={<PageTransition><ProductEditPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'transparent' }}>
        <AnimatedBackground />
        <Header />
        <main style={{ flex: 1, paddingBottom: '2rem' }}>
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
