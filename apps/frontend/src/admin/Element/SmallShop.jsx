import {Table, Button} from 'antd';
import  React,{Component} from "react"
import StoreLine from  "./StoreLine"
import {inject, observer} from "mobx-react";
import AddStoreModal from "./model/AddStoreModal"
import GetInOut from "./model/StoreInOutModal"
import StoredeleModal from "./model/StoredeleModal"

const columns = [{
    title: '物品名',
    dataIndex: 'name',
    key: 'name',
},{
    title: '库存量',
    dataIndex: 'total',
    key: 'total',
},{
    title: '操作',
    key: '_id',
    render: (index,record,text) => (
        <StoreLine record = {record} text = {text} index = {index} />
    )
}];

export default
@inject('StoreStore')
@observer
class MyTable extends Component{
    render() {
        const {StoreStore} = this.props;
        return (
            <div>
                <h4 className={"stair1Title"}>
                    -小卖部
                </h4>
                <br/>
                <Table
                    columns={columns}
                    dataSource={StoreStore.data}
                    rowKey="key"
                    pagination={{ pageSize: 6 }}
                    className={"myTable"}
                    pageSizeOptions = {['10']}
                />
                <div className={"newOrder"}>
                    <Button
                        type="primary"
                        onClick={() => StoreStore.setmodalInputBox(true)}
                    >
                        新建
                    </Button>
                </div>
                <AddStoreModal />
                <GetInOut />
                <StoredeleModal />
            </div>
        )
    }
}
