import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Orders from './pages/orders/Orders';
import Settings from './pages/settings/Settings';
import AuthGuard from './components/AuthGuard';
import Layout from './components/Layout';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AuthGuard />}>
        <Route element={<Layout />}>
          <Route path="/orders" element={<Orders />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
