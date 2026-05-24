import { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { usersApi } from '../../api';
import type { User } from '../../types';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState<Partial<User>>({ _id: '', username: '', password: '', orders: 0, powerId: '1' });
  const [errMsg, setErrMsg] = useState('');

  const load = () => usersApi.getAll().then((res) => setUsers(res.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    try {
      const route = form._id ? usersApi.update : usersApi.create;
      const res = await route(form._id ? form : { ...form, powerId: '1' });
      if (res.data && (res.data as { message?: string }).message) {
        setErrMsg((res.data as { message: string }).message);
      } else {
        setModalOpen(false);
        load();
      }
    } catch {
      message.error('操作失败');
    }
  };

  const handleDelete = async () => {
    await usersApi.delete(form);
    setDeleteOpen(false);
    load();
  };

  const columns: ColumnsType<User> = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '用户密码', dataIndex: 'password', key: 'password' },
    { title: '订单数', dataIndex: 'orders', key: 'orders' },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => { setForm(record); setErrMsg(''); setModalOpen(true); }}>修改</Button>
          <Button danger size="small" onClick={() => { setForm(record); setDeleteOpen(true); }}>删除</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h4 className="text-xl font-medium mb-4">-用户管理</h4>
      <Table columns={columns} dataSource={users} rowKey="_id" pagination={{ pageSize: 6 }} />
      <div className="text-right mt-2">
        <Button type="primary" onClick={() => { setForm({ _id: '', username: '', password: '', orders: 0, powerId: '1' }); setErrMsg(''); setModalOpen(true); }}>
          新建
        </Button>
      </div>

      <Modal title="用户" open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} maskClosable={false}>
        <div className="space-y-4 my-4">
          <div className="flex items-center gap-4">
            <span className="w-20">用户名：</span>
            <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-20">密码：</span>
            <Input.Password value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          {errMsg && <p className="text-red-500">{errMsg}</p>}
        </div>
      </Modal>

      <Modal title="确认删除" open={deleteOpen} onOk={handleDelete} onCancel={() => setDeleteOpen(false)} okText="确认" cancelText="取消">
        <p>确认删除该用户？</p>
      </Modal>
    </div>
  );
}
