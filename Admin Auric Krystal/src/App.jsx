import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import QuizConfig from './pages/QuizConfig';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="quiz" element={<QuizConfig />} />
          <Route path="analytics" element={<div className="text-center py-20 text-neutral-400">Analytics page coming soon...</div>} />
          <Route path="settings" element={<div className="text-center py-20 text-neutral-400">Settings page coming soon...</div>} />
          <Route path="*" element={<div className="text-center py-20 text-neutral-400">Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
