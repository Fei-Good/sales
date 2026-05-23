import {inject, observer} from "mobx-react";
import React,{ Component } from "react"
import { Modal } from "antd";

export default
@inject('StoreStore')
@observer
class MyTable extends Component{
    render(){
        const { StoreStore } = this.props;
        return (
            <Modal
                title="确认删除"
                visible={StoreStore.modalDele}
                onOk={StoreStore.deleteStore}
                onCancel={() => StoreStore.setDeleModal(false) }
                okText="确认"
                cancelText="取消"
                maskClosable={false}
                width={300}
            >
                <div>
                    <div>
                        <span>
                            品名：
                        </span>
                        <span>
                            {StoreStore.InputBox.name}
                        </span>
                    </div>
                    <div>
                        <span>
                            库存量：
                        </span>
                        <span>
                            {StoreStore.InputBox.total}
                        </span>
                    </div>
                    确认删除该库存？
                </div>
            </Modal>
        )
    }
}