import {inject, observer} from "mobx-react";
import React,{ Component } from "react"
import { Modal,Input } from "antd";

export default
@inject('StorePrice')
@observer
class MyTable extends Component{
    render(){
        const { StorePrice } = this.props;
        return (
            <Modal
                title={"修改价格"}
                style={{ top: 20 }}
                centered
                visible={StorePrice.modalInputBox}
                onOk={StorePrice.inputUpdate}
                onCancel={() => StorePrice.setmodalInputBox(false)}
                width = {400}
                className={"myModal1"}
                maskClosable={false}
            >
                <div>
                    <div className={"storeModalInput"}>
                         <span>
                            物品名称：
                        </span>
                        <span>
                            {StorePrice.InputBox.ZHname}
                        </span>
                    </div>
                    <div className={"storeModalInput"}>
                        <span>
                            价格：
                        </span>
                        <Input
                            name={"price"}
                            onChange={(e)=>StorePrice.setValue(e)}
                            value={StorePrice.InputBox.price}
                            style={{ width: '150px' }}
                            size={"default"}
                        />
                    </div>
                    <div className={"usermessage"}>
                        {StorePrice.message}
                    </div>
                </div>
            </Modal>
        )
    }
}