import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Radio, Spin, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { authApi } from '../../api';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string; powerId: string }) => {
    setLoading(true);
    try {
      const res = await authApi.login(values.username, values.password, values.powerId);
      if (res.data.isLogined) {
        localStorage.setItem('token', res.data.token);
        navigate('/orders');
      } else {
        message.error('密码错误或无此用户');
      }
    } catch {
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700">
      <div className="w-[420px] bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">PL</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">漂流售票后台管理系统</h2>
          <p className="text-gray-400 mt-1">请登录您的账号</p>
        </div>
        <Spin spinning={loading}>
          <Form name="login" initialValues={{ powerId: '1' }} onFinish={onFinish} size="large">
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="用户名" className="rounded-lg" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="密码" className="rounded-lg" />
            </Form.Item>
            <Form.Item name="powerId">
              <Radio.Group>
                <Radio value="1">管理员</Radio>
                <Radio value="2">超级管理员</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block className="h-11 rounded-lg text-base font-medium bg-gradient-to-r from-blue-500 to-indigo-600 border-none shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50">
                登 录
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
}
