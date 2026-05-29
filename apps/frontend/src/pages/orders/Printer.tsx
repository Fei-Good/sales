import type { Order, Price } from '../../types';

interface Props {
  data: Partial<Order> | null;
  price: Price;
}

export default function Printer({ data, price }: Props) {
  if (!data) return null;
  const timeStr = data.printTime || `${(data.time || '').replace(/-/g, '/')}`;
  const personAll = (data.adultNum || 0) + (data.childNum || 0);
  const totalLow = (data.adultNum || 0) * price.adultPrice + (data.childNum || 0) * price.childPrice;

  return (
    <form id="form1" style={{ display: 'none' }}>
      <table style={{ borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td colSpan={7} style={{ height: 70, border: 'none', textAlign: 'center', fontSize: 20, fontWeight: 500 }}>
              青城两河漂流门票
              <span style={{ fontSize: 13, position: 'relative', top: 26, left: 50 }}>{timeStr}</span>
            </td>
          </tr>
          <tr>
            <td>票据种类：</td>
            <td>{data.platform}</td>
            <td>价格</td>
            <td colSpan={3}>{data.platform !== '现场' ? 0 : `${price.adultPrice}元`}</td>
            <td rowSpan={6} style={{ border: 'none', width: 130, verticalAlign: 'top', lineHeight: 1.7 }}>
              <div>
                <span>*凭漂流票领取生衣船桨各一套：儿童无桨</span>
                <br />
                <span>*漂流完成后到装备领取处退还所领物品，检查完好无误后，到购票处退还押金</span>
                <br />
                <span>*本券当日有效</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>人数：</td>
            <td>{personAll}人</td>
            <td>小计票价：</td>
            <td colSpan={3}>{data.platform !== '现场' ? 0 : `${totalLow}元`}</td>
          </tr>
          <tr>
            <td>成人数量：</td>
            <td>{data.adultNum}人</td>
            <td>儿童数量：</td>
            <td colSpan={3}>{data.childNum}人</td>
          </tr>
          <tr>
            <td>押金：</td>
            <td>{data.deposite || 0}元</td>
            <td>安全服：</td>
            <td>{personAll}</td>
            <td>浆板：</td>
            <td>{data.adultNum}</td>
          </tr>
          <tr>
            <td>合计大写：</td>
            <td colSpan={5}>{data.platform !== '现场' ? data.deposite : data.totalMoney}</td>
          </tr>
          <tr>
            <td>联系方式：</td>
            <td colSpan={3}>{data.phoneNumber}</td>
            <td>备注：</td>
            <td>{data.remark || ''}</td>
          </tr>
          <tr>
            <td colSpan={7} style={{ borderRight: 'none', borderBottom: 'none' }}>
              说明：1、白色联还装备和押金使用；2、粉色联领取装备使用；3、黄色联漂流入口使用
              <br />
              谨记：请切记保管好白色联勿丢失，破损将影响押金退还；票经售出，概不退票，手工涂改本票作废，当日有效
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}
