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
    <div className="flex justify-center mt-32">
      <div className="w-[400px] bg-gray-200/80 p-10 rounded">
        <h2 className="text-center text-2xl mb-2">管理员后台管理系统</h2>
        <p className="text-center text-xl mb-6">登录</p>
        <Spin spinning={loading}>
          <Form
            name="login"
            initialValues={{ powerId: '1' }}
            onFinish={onFinish}
          >
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input prefix={<UserOutlined />} placeholder="用户名" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>
            <Form.Item name="powerId">
              <Radio.Group>
                <Radio value="1">管理员</Radio>
                <Radio value="2">超级管理员</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
}
