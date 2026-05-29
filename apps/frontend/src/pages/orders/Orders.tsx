import { useEffect, useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Table, Button, Input, Select, DatePicker, Modal, InputNumber, message, Card, Tag } from 'antd';
import { PlusOutlined, TeamOutlined, ManOutlined, SmileOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { ordersApi, priceApi, usersApi } from '../../api';
import type { Order, Price, UserMessage } from '../../types';
import Printer from './Printer';

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

const PLATFORMS = ['各平台', '抖音', '美团', '现场', '携程', '其他'];
const PAY_WAYS = ['微信', '支付宝', '现金'];
const PLATFORM_OPTIONS = ['抖音', '美团', '现场', '携程', '其他'];

const defaultOrder = (): Partial<Order> => ({
  _id: '',
  platform: '抖音',
  payWay: '微信',
  depositePayWay: '微信',
  adultNum: 0,
  childNum: 0,
  accidentNum: 0,
  deposite: 100,
  totalMoney: 100,
  isReback: 'false',
  ifFinish: 'ed',
  phoneNumber: '',
  remark: '',
  time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
});

export default function Orders() {
  const { user } = useOutletContext<{ user: UserMessage }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [price, setPrice] = useState<Price>({ _id: '', adultPrice: 80, childPrice: 40, plupPrice: 50, clothPrice: 30 });
  const [saler, setSaler] = useState('');
  const [loading, setLoading] = useState(false);

  const [filterPlat, setFilterPlat] = useState('各平台');
  const [filterTime, setFilterTime] = useState<[Dayjs, Dayjs] | null>(null);
  const [searchNum, setSearchNum] = useState('');
  const [phoneSuffix, setPhoneSuffix] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [rebackRecord, setRebackRecord] = useState<Order | null>(null);
  const [remarkRecord, setRemarkRecord] = useState<Order | null>(null);
  const [remarkValue, setRemarkValue] = useState('');
  const [form, setForm] = useState<Partial<Order>>(defaultOrder());
  const [printData, setPrintData] = useState<Partial<Order> | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportRange, setExportRange] = useState<[Dayjs, Dayjs] | null>(null);

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

  const handlePhoneSearch = (value: string) => {
    setPhoneSuffix(value);
  };

  const filtered = useMemo(() => {
    return orders.filter((item) => {
      if (filterTime) {
        const t = dayjs(item.time);
        if (!t.isBetween(filterTime[0], filterTime[1], 'day', '[]')) return false;
      }
      if (filterPlat !== '各平台') {
        if (filterPlat === '其他') {
          if (['抖音', '美团', '现场', '携程'].includes(item.platform)) return false;
        } else if (item.platform !== filterPlat) return false;
      }
      if (searchNum && item.orderNum !== searchNum) return false;
      if (phoneSuffix && !(item.phoneNumber || '').endsWith(phoneSuffix)) return false;
      return true;
    });
  }, [orders, filterPlat, filterTime, searchNum, phoneSuffix]);

  const totalPeople = useMemo(() => filtered.reduce((s, o) => s + (o.adultNum || 0) + (o.childNum || 0), 0), [filtered]);
  const totalAdult = useMemo(() => filtered.reduce((s, o) => s + (o.adultNum || 0), 0), [filtered]);
  const totalChild = useMemo(() => filtered.reduce((s, o) => s + (o.childNum || 0), 0), [filtered]);

  const calcTotal = (f: Partial<Order>) =>
    (f.adultNum || 0) * price.adultPrice + (f.childNum || 0) * price.childPrice + (f.deposite || 0);

  const updateForm = (key: string, value: unknown) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'payWay') next.depositePayWay = value as string;
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

  const doSubmit = async (data: Partial<Order>) => {
    try {
      if (!data._id) {
        const res = await ordersApi.create({ ...data, saler });
        setOrders((prev) => [res.data.result, ...prev]);
        setPrintData(res.data.result);
      } else {
        await ordersApi.update(data);
        load();
      }
      setModalOpen(false);
      message.success('提交成功');
    } catch {
      message.error('提交失败');
    }
  };

  const handleSubmit = async () => {
    doSubmit(form);
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

  const handleToggleReback = async () => {
    if (!rebackRecord) return;
    const newVal = rebackRecord.isReback === 'true' ? 'false' : 'true';
    try {
      await ordersApi.update({ _id: rebackRecord._id, isReback: newVal });
      setOrders((prev) => prev.map((o) => o._id === rebackRecord._id ? { ...o, isReback: newVal } : o));
      setRebackRecord(null);
    } catch {
      message.error('更新失败');
    }
  };

  const handleSaveRemark = async () => {
    if (!remarkRecord) return;
    try {
      await ordersApi.update({ _id: remarkRecord._id, remark: remarkValue });
      setOrders((prev) => prev.map((o) => o._id === remarkRecord._id ? { ...o, remark: remarkValue } : o));
      setForm((prev) => (prev._id === remarkRecord._id ? { ...prev, remark: remarkValue } : prev));
      setRemarkRecord(null);
      message.success('备注更新成功');
    } catch {
      message.error('更新失败');
    }
  };

  const handleExport = async () => {
    if (!exportRange) { message.warning('请选择导出时间范围'); return; }
    const start = exportRange[0].format('YYYY-MM-DD');
    const end = exportRange[1].format('YYYY-MM-DD');
    try {
      const res = await ordersApi.exportCsv(start, end);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_${start}_${end}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setExportOpen(false);
    } catch {
      message.error('导出失败');
    }
  };

  const columns: ColumnsType<Order> = [
    { title: '订单号', dataIndex: 'orderNum', key: 'orderNum', width: 180 },
    { title: '日期', dataIndex: 'time', key: 'time', width: 150 },
    { title: '平台', dataIndex: 'platform', key: 'platform', width: 80 },
    { title: '支付', dataIndex: 'payWay', key: 'payWay', width: 70 },
    { title: '押金', dataIndex: 'deposite', key: 'deposite', width: 60 },
    { title: '成人', dataIndex: 'adultNum', key: 'adultNum', width: 60 },
    { title: '儿童', dataIndex: 'childNum', key: 'childNum', width: 60 },
    { title: '总价', dataIndex: 'totalMoney', key: 'totalMoney', width: 70 },
    { title: '手机号', dataIndex: 'phoneNumber', key: 'phoneNumber', width: 120 },
    { title: '退押金', dataIndex: 'isReback', key: 'isReback', width: 90, render: (v, record) => {
      if (record.deposite === 0) return <Tag color="default">无押金</Tag>;
      return (
        <Tag className="cursor-pointer" color={v === 'true' ? 'green' : 'red'} onClick={() => setRebackRecord(record)}>
          {v === 'true' ? '已退' : '未退'}
        </Tag>
      );
    } },
    { title: '售票员', dataIndex: 'saler', key: 'saler', width: 80 },
    { title: '打印时间', dataIndex: 'printTime', key: 'printTime', width: 150 },
    { title: '备注（点击修改）', dataIndex: 'remark', key: 'remark', width: 170, render: (v, record) => (
      <span
        className={v ? "text-orange-500 cursor-pointer" : "cursor-pointer"}
        onClick={() => { setRemarkRecord(record); setRemarkValue(v || ''); }}
      >
        {v ? (v.length > 6 ? v.slice(0, 6) + '...' : v) : '-'}
      </span>
    ) },
    {
      title: '操作', key: 'action', width: 60,
      render: (_, record) => (
        <Button danger size="small" onClick={() => {
          if (user.powerId === '2') { setForm(record); setDeleteOpen(true); }
          else message.warning('没有权限');
        }}>删除</Button>
      ),
    },
  ];

  useEffect(() => {
    if (!printData?._id) return;
    setTimeout(() => {
      try {
        const LODOP = (window as any).getLodop?.();
        if (!LODOP || !LODOP.SET_PRINT_PAGESIZE) {
          markPrintError(printData._id!);
          return;
        }
        LODOP.SET_PRINT_PAGESIZE(3, "210mm", "15mm", "");
        const allstyle = `table{font-size:12px}table td{padding:2px 5px;border:1px #000 solid;margin:0}table td:nth-child(2n-1){width:75px}table td:nth-child(2n){width:95px;text-align:right}`;
        const strFormHtml = `<style>${allstyle}</style><body>${document.getElementById("form1")?.innerHTML || ''}</body>`;
        LODOP.ADD_PRINT_HTM(10, 40, 1000, 800, strFormHtml);
        LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS", true);
        LODOP.On_Return = function (_: string, value: string) {
          if (value === "0" || value === "false") {
            markPrintError(printData._id!);
          }
        };
        LODOP.PRINT();
      } catch {
        markPrintError(printData._id!);
      }
    }, 300);
  }, [printData]);

  const markPrintError = async (id: string) => {
    try {
      await ordersApi.update({ _id: id, remark: '错票' });
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, remark: '错票' } : o));
      message.warning('打印异常，已自动标记错票备注');
    } catch { /* ignore */ }
  };

  const resetFilters = () => { setFilterPlat('各平台'); setFilterTime(null); setSearchNum(''); setPhoneSuffix(''); load(); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">订单管理</h2>
        <div className="flex gap-2">
          <Button icon={<DownloadOutlined />} onClick={() => setExportOpen(true)} className="rounded-lg h-9">导出CSV</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleNew} className="rounded-lg h-9 bg-gradient-to-r from-blue-500 to-indigo-600 border-none shadow-md shadow-blue-500/20">新建订单</Button>
        </div>
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
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <RangePicker format="YYYY-MM-DD" value={filterTime} onChange={(dates) => setFilterTime(dates as [Dayjs, Dayjs] | null)} placeholder={['开始时间', '结束时间']} className="rounded-lg" />
            <Select value={filterPlat} onChange={setFilterPlat} style={{ width: 120 }} className="rounded-lg">
              {PLATFORMS.map((p) => <Select.Option key={p} value={p}>{p}</Select.Option>)}
            </Select>
            <Button onClick={resetFilters} className="rounded-lg">重置</Button>
          </div>
          <div className="flex items-center gap-2">
            <Input.Search placeholder="手机尾号查询" onSearch={handlePhoneSearch} enterButton style={{ width: 180 }} className="rounded-lg" />
            <Input.Search placeholder="订单号查询" onSearch={setSearchNum} enterButton style={{ width: 180 }} className="rounded-lg" />
          </div>
        </div>

        <Table columns={columns} dataSource={filtered} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} size="middle" scroll={{ x: 1200 }} />
      </Card>

      <Modal title={form._id ? '编辑订单' : '新建订单'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={460} maskClosable={false}>
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
            <span className="text-gray-500">押金</span>
            <InputNumber min={0} value={form.deposite} onChange={(v) => updateForm('deposite', v || 0)} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">联系方式</span>
            <Input
              value={form.phoneNumber}
              onChange={(e) => { if (!/\D/.test(e.target.value)) updateForm('phoneNumber', e.target.value); }}
              style={{ width: 180 }}
            />
          </div>
          <div className="flex justify-between items-start">
            <span className="text-gray-500">备注</span>
            <Input.TextArea
              value={form.remark || ''}
              onChange={(e) => updateForm('remark', e.target.value)}
              placeholder="请输入备注（默认空）"
              rows={3}
              style={{ width: 180 }}
            />
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-gray-700 font-medium">总价</span>
            <span className="text-xl font-semibold text-blue-600">{form.totalMoney}元</span>
          </div>
        </div>
      </Modal>

      <Modal title="确认删除" open={deleteOpen} onOk={handleDelete} onCancel={() => setDeleteOpen(false)} okText="确认" cancelText="取消" okButtonProps={{ danger: true }}>
        <p className="text-gray-600">将永久删除这一条订单，此操作不可撤销。</p>
      </Modal>

      <Modal title="确认退押金" open={!!rebackRecord} onOk={handleToggleReback} onCancel={() => setRebackRecord(null)} okText="确认" cancelText="取消">
        <p className="text-gray-600">
          {rebackRecord?.isReback === 'true' ? '确认将押金状态改为"未退"？' : '确认已退还押金？'}
        </p>
      </Modal>

      <Modal title="编辑备注" open={!!remarkRecord} onOk={handleSaveRemark} onCancel={() => setRemarkRecord(null)} okText="保存" cancelText="取消">
        <div className="py-4">
          <Input.TextArea value={remarkValue} onChange={(e) => setRemarkValue(e.target.value)} placeholder="请输入备注（如：错票、跳号等）" rows={4} />
        </div>
      </Modal>

      <Modal title="选择导出时间范围" open={exportOpen} onOk={handleExport} onCancel={() => setExportOpen(false)} okText="导出" cancelText="取消">
        <div className="py-4">
          <RangePicker format="YYYY-MM-DD" value={exportRange} onChange={(dates) => setExportRange(dates as [Dayjs, Dayjs] | null)} placeholder={['开始时间', '结束时间']} className="w-full" />
        </div>
      </Modal>

      <Printer data={printData} price={price} />
    </div>
  );
}
