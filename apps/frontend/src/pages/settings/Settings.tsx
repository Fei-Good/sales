import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import UserManagement from './UserManagement';
import PriceManagement from './PriceManagement';
import StoreManagement from './StoreManagement';

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <UserManagement />
      <PriceManagement />
      <StoreManagement />
      <div className="text-right">
        <Button type="primary" onClick={() => navigate('/orders')}>返回</Button>
      </div>
    </div>
  );
}
