import { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { priceApi } from '../../api';
import type { Price } from '../../types';

interface PriceRow {
  key: string;
  name: string;
  ZHname: string;
  price: number;
}

const LABELS: Record<string, string> = {
  adultPrice: '成人票价',
  childPrice: '儿童票价',
  plupPrice: '浆板价格',
  clothPrice: '安全服价格',
};

export default function PriceManagement() {
  const [priceData, setPriceData] = useState<Price | null>(null);
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<PriceRow | null>(null);
  const [editValue, setEditValue] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const load = async () => {
    const res = await priceApi.getAll();
    const p = res.data[0];
    if (!p) return;
    setPriceData(p);
    const list: PriceRow[] = Object.entries(p)
      .filter(([k]) => k !== '_id')
      .map(([k, v]) => ({ key: k, name: k, ZHname: LABELS[k] || k, price: v as number }));
    setRows(list);
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (row: PriceRow) => {
    setEditRow(row);
    setEditValue(String(row.price));
    setErrMsg('');
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (/\D/.test(editValue)) { setErrMsg('请输入纯数字！'); return; }
    if (!priceData || !editRow) return;
    const updated = { ...priceData, [editRow.name]: Number(editValue) };
    try {
      await priceApi.update(updated);
      setModalOpen(false);
      message.success('提交成功');
      load();
    } catch {
      message.error('提交失败');
    }
  };

  const columns: ColumnsType<PriceRow> = [
    { title: '物品', dataIndex: 'ZHname', key: 'ZHname' },
    { title: '价格', dataIndex: 'price', key: 'price' },
    {
      title: '操作', key: 'action',
      render: (_, record) => <Button size="small" onClick={() => handleEdit(record)}>修改</Button>,
    },
  ];

  return (
    <div>
      <h4 className="text-xl font-medium mb-4">-价格设置</h4>
      <Table columns={columns} dataSource={rows} rowKey="key" pagination={{ pageSize: 6 }} />

      <Modal title="修改价格" open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} maskClosable={false}>
        <div className="space-y-4 my-4">
          <div className="flex items-center gap-4">
            <span className="w-20">{editRow?.ZHname}：</span>
            <Input value={editValue} onChange={(e) => { setEditValue(e.target.value); setErrMsg(''); }} />
          </div>
          {errMsg && <p className="text-red-500">{errMsg}</p>}
        </div>
      </Modal>
    </div>
  );
}
