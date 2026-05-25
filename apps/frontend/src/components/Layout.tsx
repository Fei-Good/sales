import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { ShoppingCartOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { authApi, usersApi } from '../api';
import type { UserMessage } from '../types';

const NAV_ITEMS = [
  { path: '/orders', label: '订单管理', icon: <ShoppingCartOutlined /> },
  { path: '/settings', label: '系统设置', icon: <SettingOutlined />, admin: true },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserMessage>({ username: '', powerId: '1' });

  useEffect(() => {
    usersApi.getUserMessage().then((res) => setUser(res.data));
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-white shadow-lg flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mr-2 flex items-center justify-center">
            <span className="text-white text-xs font-bold">PL</span>
          </div>
          <span className="text-lg font-semibold text-gray-800">漂流售票</span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.filter((item) => !item.admin || user.powerId === '2').map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 truncate">{user.username}</span>
            <Button type="text" size="small" icon={<LogoutOutlined />} onClick={handleLogout} className="text-gray-400 hover:text-red-500" />
          </div>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}
