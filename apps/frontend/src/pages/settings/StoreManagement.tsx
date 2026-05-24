import { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { storeApi } from '../../api';
import type { StoreItem } from '../../types';

export default function StoreManagement() {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [inOutOpen, setInOutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState<Partial<StoreItem>>({ _id: '', name: '', total: 0 });
  const [inOutType, setInOutType] = useState<'add' | 'sub'>('add');
  const [errMsg, setErrMsg] = useState('');

  const load = () => storeApi.getAll().then((res) => setItems(res.data));
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (errMsg) return;
    try {
      const res = await storeApi.create(form);
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

  const handleInOut = async () => {
    if (errMsg) return;
    const total = inOutType === 'add' ? form.total : -(form.total || 0);
    try {
      const res = await storeApi.update({ ...form, total: total as number });
      if (res.data && (res.data as { message?: string }).message) {
        setErrMsg((res.data as { message: string }).message);
      } else {
        setInOutOpen(false);
        load();
      }
    } catch {
      message.error('操作失败');
    }
  };

  const handleDelete = async () => {
    if (!form._id) return;
    await storeApi.delete(form._id);
    setDeleteOpen(false);
    load();
  };

  const validateNum = (val: string) => {
    if (/\D/.test(val)) { setErrMsg('请输入纯数字！'); return false; }
    setErrMsg('');
    return true;
  };

  const columns: ColumnsType<StoreItem> = [
    { title: '物品名', dataIndex: 'name', key: 'name' },
    { title: '库存量', dataIndex: 'total', key: 'total' },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => { setForm({ ...record, total: 0 }); setInOutType('add'); setErrMsg(''); setInOutOpen(true); }}>入库</Button>
          <Button size="small" onClick={() => { setForm({ ...record, total: 0 }); setInOutType('sub'); setErrMsg(''); setInOutOpen(true); }}>出库</Button>
          <Button danger size="small" onClick={() => { setForm(record); setDeleteOpen(true); }}>删除</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h4 className="text-xl font-medium mb-4">-小卖部</h4>
      <Table columns={columns} dataSource={items} rowKey="_id" pagination={{ pageSize: 6 }} />
      <div className="text-right mt-2">
        <Button type="primary" onClick={() => { setForm({ _id: '', name: '', total: 0 }); setErrMsg(''); setModalOpen(true); }}>新建</Button>
      </div>

      <Modal title="新建物品" open={modalOpen} onOk={handleCreate} onCancel={() => setModalOpen(false)} maskClosable={false}>
        <div className="space-y-4 my-4">
          <div className="flex items-center gap-4">
            <span className="w-20">名称：</span>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-20">数量：</span>
            <Input value={String(form.total || '')} onChange={(e) => { if (validateNum(e.target.value)) setForm({ ...form, total: Number(e.target.value) }); }} />
          </div>
          {errMsg && <p className="text-red-500">{errMsg}</p>}
        </div>
      </Modal>

      <Modal title={inOutType === 'add' ? '入库' : '出库'} open={inOutOpen} onOk={handleInOut} onCancel={() => setInOutOpen(false)} maskClosable={false}>
        <div className="space-y-4 my-4">
          <div className="flex items-center gap-4">
            <span className="w-20">数量：</span>
            <Input value={String(form.total || '')} onChange={(e) => { if (validateNum(e.target.value)) setForm({ ...form, total: Number(e.target.value) }); }} />
          </div>
          {errMsg && <p className="text-red-500">{errMsg}</p>}
        </div>
      </Modal>

      <Modal title="确认删除" open={deleteOpen} onOk={handleDelete} onCancel={() => setDeleteOpen(false)} okText="确认" cancelText="取消">
        <p>确认删除该物品？</p>
      </Modal>
    </div>
  );
}
