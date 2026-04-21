import { useMemo } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import CategoriesOverviewPage from './pages/CategoriesOverviewPage'
import MainCategoryPage from './pages/MainCategoryPage'
import SearchResultsPage from './pages/SearchResultsPage'
import AutoUpgradesPage from './pages/AutoUpgradesPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import VerifyResetPage from './pages/VerifyResetPage'
import NewPasswordPage from './pages/NewPasswordPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import LegalPage from './pages/LegalPage'
import HelpPage from './pages/HelpPage'
import AuthCallback from './pages/AuthCallback'
import ProtectedRoute from './components/ProtectedRoute'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 w-full min-h-0 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

/**
 * OAuth callback MUST be its own top-level route (no Navbar/Footer).
 * Listed first so it always wins over the `/` layout tree.
 */
function createAppRouter() {
  return createBrowserRouter([
    {
      path: '/auth/callback',
      element: <AuthCallback />,
    },
    {
      path: '/',
      element: <AppShell />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'auto-upgrades', element: <AutoUpgradesPage /> },
        { path: 'search', element: <SearchResultsPage /> },
        { path: 'products', element: <CategoriesOverviewPage /> },
        { path: 'category/:mainCategory', element: <MainCategoryPage /> },
        { path: 'products/:category', element: <ProductsPage /> },
        { path: 'products/:category/:productId', element: <ProductDetailPage /> },
        { path: 'cart', element: <CartPage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <RegisterPage /> },
        { path: 'verify-email', element: <VerifyEmailPage /> },
        { path: 'legal/:slug', element: <LegalPage /> },
        { path: 'privacy-policy', element: <Navigate to="/legal/privacy" replace /> },
        { path: 'terms', element: <Navigate to="/legal/terms" replace /> },
        { path: 'refund-policy', element: <Navigate to="/legal/refund-policy" replace /> },
        { path: 'orders', element: <Navigate to="/account#orders" replace /> },
        { path: 'delivery', element: <Navigate to="/help#delivery" replace /> },
        { path: 'returns', element: <Navigate to="/help#returns" replace /> },
        { path: 'help', element: <HelpPage /> },
        { path: 'forgot-password', element: <ForgotPasswordPage /> },
        { path: 'verify-reset', element: <VerifyResetPage /> },
        { path: 'new-password', element: <NewPasswordPage /> },
        {
          path: 'account',
          element: (
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ])
}

function App() {
  const router = useMemo(() => createAppRouter(), [])

  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
