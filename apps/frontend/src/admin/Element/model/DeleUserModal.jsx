import {inject, observer} from "mobx-react";
import React,{ Component } from "react"
import { Modal } from "antd";

export default
@inject('StoreSet')
@observer
class MyTable extends Component{
    render(){
        const { StoreSet } = this.props;
        return (
            <Modal
                title="确认删除"
                visible={StoreSet.deleModal}
                onOk={StoreSet.handleDelete}
                onCancel={() => StoreSet.setDeleModal(false) }
                okText="确认"
                maskClosable={false}
                cancelText="取消"
            >
                <p>
                    将永久删除该用户？
                </p>
            </Modal>
        )
    }
}