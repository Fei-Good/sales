import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { authApi, usersApi } from '../api';
import type { UserMessage } from '../types';

export default function Layout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserMessage>({ username: '', powerId: '1' });

  useEffect(() => {
    usersApi.getUserMessage().then((res) => setUser(res.data));
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/login');
  };

  return (
    <div>
      <header className="flex items-center justify-between my-10">
        <span className="text-xl font-medium">漂流后台管理系统</span>
        <div className="flex items-center gap-4">
          <span>欢迎你：{user.username}</span>
          <Button danger onClick={handleLogout}>注销</Button>
        </div>
      </header>
      <Outlet context={{ user }} />
    </div>
  );
}
