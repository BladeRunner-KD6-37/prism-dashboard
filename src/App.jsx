import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'


const Products = lazy(() => import('./pages/Products'))
const ProductsHome = lazy(() => import('./pages/ProductsHome'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Cart = lazy(() => import('./pages/Cart'))

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
      <Route path="/" element={<Navigate to="/products/home" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/products/home"
          element={
            <Suspense fallback={<PageFallback />}>
              <ProductsHome />
            </Suspense>
          }
        />
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
        <Route
          path="/cart"
          element={
            <Suspense fallback={<PageFallback />}>
              <Cart />
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<div className="p-8 text-center text-xl">404 — Page not found</div>} />
    </Routes>
  )
}

export default App