import { Tabs, Card } from 'antd';
import { UserOutlined, DollarOutlined, ShopOutlined } from '@ant-design/icons';
import UserManagement from './UserManagement';
import PriceManagement from './PriceManagement';
import StoreManagement from './StoreManagement';

export default function Settings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">系统设置</h2>
      <Card className="rounded-xl border-0 shadow-sm">
        <Tabs
          defaultActiveKey="users"
          items={[
            { key: 'users', label: <span><UserOutlined className="mr-1" />用户管理</span>, children: <UserManagement /> },
            { key: 'price', label: <span><DollarOutlined className="mr-1" />价格设置</span>, children: <PriceManagement /> },
            { key: 'store', label: <span><ShopOutlined className="mr-1" />小卖部</span>, children: <StoreManagement /> },
          ]}
        />
      </Card>
    </div>
  );
}
