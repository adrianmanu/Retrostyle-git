import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CatalogProvider } from './context/CatalogContext'
import { CartProvider } from './context/CartContext'
import { ReviewsProvider } from './context/ReviewsContext'
import { Layout } from './components/Layout'
import { RequireAuth } from './components/ProtectedRoutes'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { ProductPage } from './pages/ProductPage'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Checkout } from './pages/Checkout'
import { Account } from './pages/Account'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminCategories } from './pages/admin/AdminCategories'
import { AdminProducts } from './pages/admin/AdminProducts'
import { AdminPedidos } from './pages/admin/AdminPedidos'

/** Coincide con `base` de Vite (GitHub Pages: /nombre-repo/). */
const routerBasename =
  import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

export default function App() {
  return (
    <AuthProvider>
      <CatalogProvider>
        <CartProvider>
          <ReviewsProvider>
          <BrowserRouter basename={routerBasename}>
            <Routes>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="pedidos" element={<AdminPedidos />} />
                <Route path="categorias" element={<AdminCategories />} />
                <Route path="productos" element={<AdminProducts />} />
              </Route>

              <Route path="/*" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="tienda" element={<Shop />} />
                <Route path="producto/:slug" element={<ProductPage />} />
                <Route path="login" element={<Login />} />
                <Route path="registro" element={<Register />} />
                <Route element={<RequireAuth />}>
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="cuenta" element={<Account />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
          </ReviewsProvider>
        </CartProvider>
      </CatalogProvider>
    </AuthProvider>
  )
}
