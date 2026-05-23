import {inject, observer} from "mobx-react";
import React,{ Component } from "react"
import { Modal,Input } from "antd";

export default
@inject('StoreStore')
@observer
class MyTable extends Component{
    render(){
        const { StoreStore } = this.props;
        return (
            <Modal
                title="新建物品"
                style={{ top: 20 }}
                centered
                visible={StoreStore.modalInputBox}
                onOk={StoreStore.inputUpdate}
                onCancel={() => StoreStore.setmodalInputBox(false)}
                maskClosable={false}
                width = {400}
                className={"myModal1"}
            >
                <div>
                    <div className={"storeModalInput"}>
                         <span>
                            品名：
                        </span>
                        <Input
                            name={"name"}
                            onChange={(e)=>StoreStore.setValue(e)}
                            value={StoreStore.InputBox.name}
                            size={"default"}
                            style={{ width: '150px' }}
                        />
                    </div>
                   <div className={"storeModalInput"}>
                        <span>
                            初始数量：
                        </span>
                       <Input
                           name={"total"}
                           onChange={(e)=>StoreStore.setValue(e)}
                           value={StoreStore.InputBox.total}
                           style={{ width: '150px' }}
                           size={"default"}
                       />
                   </div>
                    <div className={"usermessage"}>
                        {StoreStore.message}
                    </div>
                </div>
            </Modal>
        )
    }
}