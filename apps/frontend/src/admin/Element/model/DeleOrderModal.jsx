import {inject, observer} from "mobx-react";
import React,{ Component } from "react"
import { Modal } from "antd";

export default
@inject('StoreOrder')
@observer
class MyTable extends Component{
    render(){
        const { StoreOrder } = this.props;
        return (
            <Modal
                title="确认删除"
                visible={StoreOrder.deleModal}
                onOk={StoreOrder.handleDelete}
                onCancel={() => StoreOrder.setDeleModal(false) }
                okText="确认"
                cancelText="取消"
                maskClosable={false}
            >
                <p>将永久删除这一条订单？</p>
            </Modal>
        )
    }
}