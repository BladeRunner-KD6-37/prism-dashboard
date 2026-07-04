import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy-loaded route components — each becomes its own JS chunk,
// only downloaded when the user actually visits that route
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Analytics = lazy(() => import('./pages/Analytics'))

function PageFallback() {
  return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      Loading...
    </div>
  )
}

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
        <Route
          path="/products"
          element={
            <Suspense fallback={<PageFallback />}>
              <Products />
            </Suspense>
          }
        />
        <Route
          path="/products/:id"
          element={
            <Suspense fallback={<PageFallback />}>
              <ProductDetail />
            </Suspense>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<PageFallback />}>
                <Analytics />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<div className="p-8 text-center text-xl">404 — Page not found</div>} />
    </Routes>
  )
}

export default App