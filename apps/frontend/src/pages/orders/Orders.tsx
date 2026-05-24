import { useEffect, useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Table, Button, Input, Select, DatePicker, Modal, InputNumber, message, Card } from 'antd';
import { PlusOutlined, TeamOutlined, ManOutlined, SmileOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { ordersApi, priceApi, usersApi } from '../../api';
import type { Order, Price, UserMessage } from '../../types';
import Printer from './Printer';

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

const PLATFORMS = ['各平台', '现场', '美团', '红苹果', '驴妈妈', '云客赞', '其他'];
const PAY_WAYS = ['现金', '微信', '支付宝'];
const PLATFORM_OPTIONS = ['现场', '美团', '红苹果', '驴妈妈', '云客赞', '其他'];

const defaultOrder = (): Partial<Order> => ({
  _id: '',
  platform: '现场',
  payWay: '现金',
  depositePayWay: '现金',
  adultNum: 0,
  childNum: 0,
  accidentNum: 0,
  deposite: 100,
  totalMoney: 100,
  isReback: 'true',
  ifFinish: 'ed',
  phoneNumber: '',
  time: dayjs().format('YYYY-MM-DD'),
});

export default function Orders() {
  const { user } = useOutletContext<{ user: UserMessage }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [price, setPrice] = useState<Price>({ _id: '', adultPrice: 80, childPrice: 40, plupPrice: 50, clothPrice: 30 });
  const [saler, setSaler] = useState('');
  const [loading, setLoading] = useState(false);

  // Filters
  const [filterPlat, setFilterPlat] = useState('各平台');
  const [filterTime, setFilterTime] = useState<[Dayjs, Dayjs] | null>(null);
  const [searchNum, setSearchNum] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState<Partial<Order>>(defaultOrder());
  const [printData, setPrintData] = useState<Partial<Order> | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [ordersRes, priceRes, salerRes] = await Promise.all([
        ordersApi.getAll(),
        priceApi.getAll(),
        usersApi.getSaler(),
      ]);
      setOrders(ordersRes.data.filter(Boolean));
      if (priceRes.data[0]) setPrice(priceRes.data[0]);
      setSaler(salerRes.data.username);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return orders.filter((item) => {
      if (filterTime) {
        const t = dayjs(item.time);
        if (!t.isBetween(filterTime[0], filterTime[1], 'day', '[]')) return false;
      }
      if (filterPlat !== '各平台') {
        if (filterPlat === '其他') {
          if (['现场', '美团', '红苹果', '驴妈妈', '云客赞'].includes(item.platform)) return false;
        } else if (item.platform !== filterPlat) return false;
      }
      if (searchNum && item.orderNum !== searchNum) return false;
      return true;
    });
  }, [orders, filterPlat, filterTime, searchNum]);

  const totalPeople = useMemo(() => filtered.reduce((s, o) => s + (o.adultNum || 0) + (o.childNum || 0), 0), [filtered]);
  const totalAdult = useMemo(() => filtered.reduce((s, o) => s + (o.adultNum || 0), 0), [filtered]);
  const totalChild = useMemo(() => filtered.reduce((s, o) => s + (o.childNum || 0), 0), [filtered]);

  const calcTotal = (f: Partial<Order>) =>
    (f.adultNum || 0) * price.adultPrice + (f.childNum || 0) * price.childPrice + (f.accidentNum || 0) * 7 + (f.deposite || 0);

  const updateForm = (key: string, value: unknown) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      next.totalMoney = calcTotal(next);
      return next;
    });
  };

  const handleNew = () => {
    const o = defaultOrder();
    o.saler = saler;
    setForm(o);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (!form._id) {
        const res = await ordersApi.create({ ...form, saler });
        setOrders((prev) => [res.data.result, ...prev]);
        setPrintData({ ...form, saler });
      } else {
        await ordersApi.update(form);
        load();
      }
      setModalOpen(false);
      message.success('提交成功');
    } catch {
      message.error('提交失败');
    }
  };

  const handleDelete = async () => {
    if (!form._id) return;
    try {
      await ordersApi.delete(form._id);
      setDeleteOpen(false);
      message.success('删除成功');
      load();
    } catch {
      message.error('删除失败');
    }
  };

  const columns: ColumnsType<Order> = [
    { title: '订单号', dataIndex: 'orderNum', key: 'orderNum' },
    { title: '平台', dataIndex: 'platform', key: 'platform' },
    { title: '支付方式', dataIndex: 'payWay', key: 'payWay' },
    { title: '押金', dataIndex: 'deposite', key: 'deposite' },
    { title: '成人', dataIndex: 'adultNum', key: 'adultNum' },
    { title: '儿童', dataIndex: 'childNum', key: 'childNum' },
    { title: '总价', dataIndex: 'totalMoney', key: 'totalMoney' },
    { title: '退押金', dataIndex: 'isReback', key: 'isReback', render: (v) => v === 'true' ? '是' : '否' },
    { title: '售票员', dataIndex: 'saler', key: 'saler' },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <Button danger size="small" onClick={() => {
          if (user.powerId === '2') { setForm(record); setDeleteOpen(true); }
          else message.warning('没有权限');
        }}>删除</Button>
      ),
    },
  ];

  const resetFilters = () => { setFilterPlat('各平台'); setFilterTime(null); setSearchNum(''); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">订单管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleNew} className="rounded-lg h-9 bg-gradient-to-r from-blue-500 to-indigo-600 border-none shadow-md shadow-blue-500/20">
          新建订单
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="rounded-xl border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><TeamOutlined className="text-blue-500 text-lg" /></div>
            <div><p className="text-xs text-gray-400">总人数</p><p className="text-xl font-semibold text-gray-800">{totalPeople}</p></div>
          </div>
        </Card>
        <Card className="rounded-xl border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center"><ManOutlined className="text-green-500 text-lg" /></div>
            <div><p className="text-xs text-gray-400">成人</p><p className="text-xl font-semibold text-gray-800">{totalAdult}</p></div>
          </div>
        </Card>
        <Card className="rounded-xl border-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center"><SmileOutlined className="text-orange-500 text-lg" /></div>
            <div><p className="text-xs text-gray-400">儿童</p><p className="text-xl font-semibold text-gray-800">{totalChild}</p></div>
          </div>
        </Card>
      </div>

      <Card className="rounded-xl border-0 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <RangePicker
              format="YYYY-MM-DD"
              value={filterTime}
              onChange={(dates) => setFilterTime(dates as [Dayjs, Dayjs] | null)}
              placeholder={['开始时间', '结束时间']}
              className="rounded-lg"
            />
            <Select value={filterPlat} onChange={setFilterPlat} style={{ width: 120 }} className="rounded-lg">
              {PLATFORMS.map((p) => <Select.Option key={p} value={p}>{p}</Select.Option>)}
            </Select>
            <Button onClick={resetFilters} className="rounded-lg">重置</Button>
          </div>
          <Input.Search placeholder="输入编号查询" onSearch={setSearchNum} enterButton style={{ width: 220 }} className="rounded-lg" />
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>

      <Modal
        title="新建订单"
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        width={460}
        maskClosable={false}
        className="rounded-xl"
      >
        <div className="space-y-4 py-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">购票平台</span>
            {PLATFORM_OPTIONS.includes(form.platform || '') ? (
              <Select value={form.platform} onChange={(v) => updateForm('platform', v)} style={{ width: 180 }}>
                {PLATFORM_OPTIONS.map((p) => <Select.Option key={p} value={p}>{p}</Select.Option>)}
              </Select>
            ) : (
              <Input value={form.platform} onChange={(e) => updateForm('platform', e.target.value)} style={{ width: 180 }} />
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">付款方式</span>
            <Select value={form.payWay} onChange={(v) => updateForm('payWay', v)} style={{ width: 180 }}>
              {PAY_WAYS.map((p) => <Select.Option key={p} value={p}>{p}</Select.Option>)}
            </Select>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">成人人数</span>
            <div className="flex items-center gap-2">
              <InputNumber min={0} value={form.adultNum} onChange={(v) => updateForm('adultNum', v || 0)} />
              <span className="text-xs text-gray-400">{price.adultPrice}元/人</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">儿童人数</span>
            <div className="flex items-center gap-2">
              <InputNumber min={0} value={form.childNum} onChange={(v) => updateForm('childNum', v || 0)} />
              <span className="text-xs text-gray-400">{price.childPrice}元/人</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">人身意外</span>
            <div className="flex items-center gap-2">
              <InputNumber min={0} value={form.accidentNum} onChange={(v) => updateForm('accidentNum', v || 0)} />
              <span className="text-xs text-gray-400">7元/人</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">押金</span><span className="font-medium">100元</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">联系方式</span>
            <Input
              value={form.phoneNumber}
              onChange={(e) => { if (!/\D/.test(e.target.value)) updateForm('phoneNumber', e.target.value); }}
              style={{ width: 180 }}
            />
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-gray-700 font-medium">总价</span>
            <span className="text-xl font-semibold text-blue-600">{form.platform !== '现场' ? form.deposite : form.totalMoney}元</span>
          </div>
        </div>
      </Modal>

      <Modal
        title="确认删除"
        open={deleteOpen}
        onOk={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p className="text-gray-600">将永久删除这一条订单，此操作不可撤销。</p>
      </Modal>

      <Printer data={printData} price={price} />
    </div>
  );
}
