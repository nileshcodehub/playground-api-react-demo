import { Routes, Route } from 'react-router';
import Layout from '@/layouts/Layout';
import MainPage from '@/pages/MainPage';
import UsersPage from '@/pages/UsersPage';
import PostsPage from '@/pages/PostsPage';
import TodosPage from '@/pages/TodosPage';
import MediaPage from '@/pages/MediaPage';
import AuthPage from '@/pages/AuthPage';
import ProductsPage from '@/pages/ProductsPage';
import CartPage from '@/pages/CartPage';
import WishlistPage from '@/pages/WishlistPage';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<MainPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/todos" element={<TodosPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Routes - accessible only when authenticated */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
