import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import DatabaseSetup from './pages/DatabaseSetup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="database-setup" element={<DatabaseSetup />} />
          <Route path="categories" element={<div className="text-center py-20 text-neutral-400">Categories page coming soon...</div>} />
          <Route path="orders" element={<div className="text-center py-20 text-neutral-400">Orders page coming soon...</div>} />
          <Route path="customers" element={<div className="text-center py-20 text-neutral-400">Customers page coming soon...</div>} />
          <Route path="quiz" element={<div className="text-center py-20 text-neutral-400">Quiz Config page coming soon...</div>} />
          <Route path="analytics" element={<div className="text-center py-20 text-neutral-400">Analytics page coming soon...</div>} />
          <Route path="settings" element={<div className="text-center py-20 text-neutral-400">Settings page coming soon...</div>} />
          <Route path="*" element={<div className="text-center py-20 text-neutral-400">Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
