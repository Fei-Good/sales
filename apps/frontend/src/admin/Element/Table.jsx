import {Table, Tabs, Input, Button} from 'antd';
import  React,{Component} from "react"
import OrderLine from  "./OrderLine"
import {inject, observer} from "mobx-react";
import SelectTime from  "./SelectTime"
import SelectPlat from  "./SelectPlat"
import AddModal from "./model/AddOrderModal"
import DeleModal from "./model/DeleOrderModal"

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const columns = [{
    title: '订单号',
    dataIndex: 'orderNum',
    key: 'orderNum',
}, {
    title: '平台',
    dataIndex: 'platform',
    key: 'platform',
}, {
    title: '支付方式',
    dataIndex: 'payWay',
    key: 'payWay',
}, {
    title: '押金方式',
    dataIndex: 'deposite',
    key: 'deposite',
},{
    title: '成人',
    dataIndex: 'adultNum',
    key: 'adultNum',
},{
    title: '儿童',
    dataIndex: 'childNum',
    key: 'childNum',
},{
    title: '总价',
    dataIndex: 'totalMoney',
    key: 'totalMoney',
},{
    title: '是否退押金',
    dataIndex: 'isReback',
    key: 'isReback',
    render: (text) =>
        text === "true"?"是":"否"
},{
    title: '售票员',
    dataIndex: 'saler',
    key: 'saler',
},{
    title: '操作',
    key: '_id',
    render: (index,record,text) => (
            <OrderLine record = {record} text = {text} index = {index} />
    )
}];

export default
@inject('StoreOrder')
@inject('StoreLogin')
@observer
class MyTable extends Component{
    componentDidMount() {
        const {StoreOrder} = this.props;
        StoreOrder.getOrders();
    }

    render() {
        const {StoreOrder} = this.props;
        return (
            <div>
                <h4 className={"stair1Title"}>
                    -订单状态
                </h4>
                <br/>
                <div className={"seach_box"}>
                    <div className={"fiters"}>
                        <span>
                            选择时间：
                        </span>
                        <SelectTime />
                        <span className={"empty"}>
                            选择平台：
                        </span>
                        <SelectPlat />
                    </div>
                    <div className={"seach_container"}>
                        <Search
                            placeholder="请输入编号查询"
                            onSearch={value => StoreOrder.setInputSearch(value)}
                            enterButton
                            value={StoreOrder.inputSearch}
                            onChange={e => StoreOrder.writeSearch(e)}
                        />
                    </div>
                </div>
                <Tabs className={"tags"} onChange={StoreOrder.setFilishFilter} type={"card"}>
                    {/*<TabPane tab="所有" key="all">*/}
                    {/*</TabPane>*/}
                    {/*<TabPane tab="待完成" key="ing">*/}
                    {/*</TabPane>*/}
                    <TabPane tab="已完成" key="ed">
                    </TabPane>
                </Tabs>

                <Table
                    bordered
                    columns={columns}
                    dataSource={StoreOrder.fiter}
                    rowKey="key"
                    pagination={{ pageSize: 6 }}
                    className={"myTable"}
                    pageSizeOptions = {['10']}
                />
                <div className={"newOrder"}>
                    <div className={"total"}>
                        共
                        { StoreOrder.fiter.length }
                        条记录
                    </div>

                    <div className={"total"}>
                        ，共
                        { StoreOrder.perserTotall }
                        人，
                        成人
                        { StoreOrder.perserTotallAdult }
                        人，
                        儿童
                        { StoreOrder.perserTotallChildren }
                        人。
                    </div>
                    <Button
                        type="primary"
                        onClick={ StoreOrder.setInitFilter }
                    >
                        默认
                    </Button>
                    <span className={"empty"}>
                    </span>
                    <Button
                        type="primary"
                        onClick={() => StoreOrder.newOrder()}
                    >
                        新建
                    </Button>
                    <span className={"empty"} />
                    {StoreOrder.userMessage.powerId === "2"?(
                        <Button
                        type="primary"
                        onClick={() => window.location.hash = "#/order/setting"}
                        >
                        设置
                        </Button>
                    ):null}
                    <AddModal />
                    <DeleModal />
                </div>
            </div>
        )
    }
}


