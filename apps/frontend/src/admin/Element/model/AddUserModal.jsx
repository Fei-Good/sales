import {inject, observer} from "mobx-react";
import React,{ Component } from "react"
import { Modal,Input } from "antd";
import storeSet from "../../store/storeSet";

export default
@inject('StoreSet')
@observer
class MyTable extends Component{
    render(){
        const { StoreSet } = this.props;
        return (
            <Modal
                title="添加用户"
                visible={StoreSet.usersModal}
                onOk={StoreSet.addUser}
                onCancel={() => StoreSet.setUsersModal(false) }
                okText="确认"
                cancelText="取消"
                maskClosable={false}
                width={400}
            >
                <div className={"inputBox"}>
                    <span className={"inputBoxSpan"}>
                        用户名：
                    </span>
                    <div className={"userInput"}>
                        <Input
                            placeholder="用户名"
                            allowClear
                            value={StoreSet.userBox.username}
                            onChange={(e) => StoreSet.updateUsername(e)}
                        />
                    </div>
                </div>
                <div className={"inputBox"}>
                    <span className={"inputBoxSpan"}>
                        密码：
                    </span>
                    <div className={"userInput"}>
                        <Input
                            placeholder="密码"
                            allowClear
                            onChange={(e) => StoreSet.updatePassword(e)}
                            value={StoreSet.userBox.password}
                        />
                    </div>
                </div>
                <div className={"newUserMessage"}>
                    {storeSet.usersMessage}
                </div>
            </Modal>
        )
    }
}