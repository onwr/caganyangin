import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Certificates from './pages/Certificates';
import Referances from './pages/Referances';
import Danismanlik from './pages/Danismanlik';
import Services from './pages/Services';
import Contact from './pages/Contact';
import CategoryDetail from './pages/CategoryDetail';
import ProductDetail from './pages/ProductDetail';
import ProtectedRoute from '@components/admin/ProtectedRoute';
import AdminLayout from '@components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Corporate from './pages/admin/Corporate';
import Settings from './pages/admin/Settings';
import Medya from './pages/admin/Medya';
import Login from './pages/admin/Login';
import ReferansBelge from './pages/admin/ReferansBelge';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/hakkimizda' element={<About />} />
      <Route path='/belgeler' element={<Certificates />} />
      <Route path='/referanslar' element={<Referances />} />
      <Route path='/danismanlik' element={<Danismanlik />} />
      <Route path='/hizmetlerimiz' element={<Services />} />
      <Route path='/iletisim' element={<Contact />} />
      <Route path='/urunler/:slug' element={<CategoryDetail />} />
      <Route path='/urun/:docId' element={<ProductDetail />} />
      <Route path='/yonetici/giris' element={<Login />} />
      <Route
        path='/admin'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/admin/products'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Products />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/admin/corporate'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Corporate />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/admin/settings'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Settings />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/admin/faaliyetler'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <ReferansBelge />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/admin/medya'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Medya />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default App;
