import React,{Component} from "react"
import {inject,observer} from "mobx-react/custom";
import {Button, Divider} from "antd";

export default
@inject("StoreStore")
@observer
class StoreLine extends Component{
    render() {
        const {StoreStore,record} = this.props;
        return (
            <div>
                <Button
                    type="primary"
                    onClick={() => StoreStore.updateInput(record,"delete")}
                >
                    今日成交
                </Button>
                <Divider type="vertical" />
                <Button
                    type="primary"
                    onClick={() => StoreStore.updateInput(record,"add")}
                >
                    进货
                </Button>
                <Divider type="vertical" />
                <Button
                    type="danger"
                    onClick={() => StoreStore.setModaldele(record)}
                >
                    删除
                </Button>
            </div>
        )
    }
}