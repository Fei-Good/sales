import {Table} from 'antd';
import  React,{Component} from "react"
import PriceLine from  "./PriceLine"
import {inject, observer} from "mobx-react";
import PriceModal from "../model/PriceModal/PriceModal"

const columns = [{
    title: '物品',
    dataIndex: 'ZHname',
    key: 'ZHname',
},{
    title: '价格',
    dataIndex: 'price',
    key: 'price',
},{
    title: '操作',
    key: '_id',
    render: (index,record,text) => (
        <PriceLine record = {record} text = {text} index = {index} />
    )
}];

export default
@inject('StorePrice')
@observer
class MyTable extends Component{
    render() {
        const {StorePrice} = this.props;
        return (
            <div>
                <h4 className={"stair1Title"}>
                    -价格设置
                </h4>
                <br/>
                <Table
                    columns={columns}
                    dataSource={StorePrice.data}
                    rowKey="key"
                    pagination={{ pageSize: 6 }}
                    className={"myTable"}
                    pageSizeOptions = {['10']}
                />

                <PriceModal />
            </div>
        )
    }
}
