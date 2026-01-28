import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';

axios.defaults.withCredentials = true;
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import Categories from './pages/Categories';
import SubCategories from './pages/SubCategories';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import QuizConfig from './pages/QuizConfig';
import Inquiries from './pages/Inquiries';
import PaymentManagement from './pages/PaymentManagement';
import PaymentSettings from './pages/PaymentSettings';
import Login from './pages/Login';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories" element={<SubCategories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="quiz" element={<QuizConfig />} />
            <Route path="payments" element={<PaymentManagement />} />
            <Route path="payment-settings" element={<PaymentSettings />} />
            <Route path="analytics" element={<div className="text-center py-20 text-neutral-400">Analytics page coming soon...</div>} />
            <Route path="*" element={<div className="text-center py-20 text-neutral-400">Page not found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
