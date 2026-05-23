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
                title={StoreStore.InputBoxing==="add"?"进货":"出售"}
                style={{ top: 20 }}
                centered
                visible={StoreStore.modalInOut}
                onOk={StoreStore.inputUpdate}
                onCancel={() => StoreStore.setModalInOut(false)}
                width = {400}
                className={"myModal1"}
                maskClosable={false}
            >
                <div>
                    <div className={"storeModalInput"}>
                         <span>
                            品名：
                        </span>
                        <span>
                            {StoreStore.InputBox.name}
                        </span>
                    </div>
                    <div className={"storeModalInput"}>
                        <span>
                            {StoreStore.InputBoxing==="add"?"进货数量":"出售数量"}
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