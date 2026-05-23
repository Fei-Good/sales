import React,{Component} from "react"
import {Button, Table} from "antd";
import NewUserModal from "../model/AddUserModal";
import DeleUser from "../model/DeleUserModal";
import UserLine from "../UserLine"
import {inject, observer} from "mobx-react";

const columns = [{
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
},{
    title: '用户密码',
    dataIndex: 'password',
    key: 'password',
},{
    title: '订单数',
    dataIndex: 'orders',
    key: 'orders',
},{
    title: '操作',
    key: '_id',
    render: (index,record,text) => (
        <UserLine record = {record} text = {text} index = {index} />
    )
}];

export default
@inject('StoreSet')
@observer
class Userset extends Component{
    render() {
        const {StoreSet} = this.props;
        return (
            <div>
                <div className={"stair1Title"}>
                    -用户管理
                </div>
                <Table
                    columns={columns}
                    dataSource={StoreSet.users.slice()}
                    rowKey="key"
                    pagination={{ pageSize: 6 }}
                    className={"myTable"}
                    pageSizeOptions = {['10']}
                />
                <div className={"newOrder"}>
                    <Button
                        type="primary"
                        onClick={StoreSet.newOrder}
                    >
                        新建
                    </Button>
                    <span className={"empty"}>
                    </span>
                    <Button
                        type="primary"
                        onClick={StoreSet.setFilish}
                    >
                        返回
                    </Button>
                </div>
                <NewUserModal />
                <DeleUser />
            </div>
        )
    }
}

