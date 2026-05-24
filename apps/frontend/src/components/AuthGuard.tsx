import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { authApi } from '../api';

export default function AuthGuard() {
  const [status, setStatus] = useState<'loading' | 'ok' | 'fail'>('loading');

  useEffect(() => {
    authApi.checkLogin()
      .then((res) => setStatus(res.data.isLogined ? 'ok' : 'fail'))
      .catch(() => setStatus('fail'));
  }, []);

  if (status === 'loading') return <Spin className="mt-40 flex justify-center" />;
  if (status === 'fail') return <Navigate to="/login" replace />;
  return <Outlet />;
}
