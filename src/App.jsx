import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/layout/Layout'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Analytics from './pages/Analytics'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requireAdmin>
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<div className="p-8 text-center text-xl">404 — Page not found</div>} />
    </Routes>
  )
}

export default App