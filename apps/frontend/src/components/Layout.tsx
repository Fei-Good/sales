import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { ShoppingCartOutlined, SettingOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
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
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    usersApi.getUserMessage().then((res) => setUser(res.data));
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className={`bg-white shadow-lg flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
        <div className="h-16 flex items-center justify-between px-3 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mr-2 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">PL</span>
            </div>
            {!collapsed && <span className="text-lg font-semibold text-gray-800">漂流售票</span>}
          </div>
          <Button
            type="text"
            size="small"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-gray-600"
          />
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {NAV_ITEMS.filter((item) => !item.admin || user.powerId === '2').map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={item.label}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 truncate flex-1">{user.username}</span>
              <Button type="text" size="small" icon={<LogoutOutlined />} onClick={handleLogout} className="text-gray-400 hover:text-red-500" />
            </div>
          ) : (
            <Button type="text" size="small" icon={<LogoutOutlined />} onClick={handleLogout} className="w-full text-gray-400 hover:text-red-500" />
          )}
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}
