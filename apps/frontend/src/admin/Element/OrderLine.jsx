import { Button } from 'antd';
import React,{Component} from  'react';
import {inject, observer} from "mobx-react";

export default
@inject('StoreOrder')
@observer
class OrderLine extends Component {
    render() {
        return (
            <div>
                {/*<Button*/}
                    {/*type="primary"*/}
                    {/*disabled = {record.ifFinish==="ing"?(false):(true)}*/}
                    {/*onClick={() => StoreOrder.updateInput(record,"repaire")}*/}
                {/*>*/}
                    {/*修改*/}
                {/*</Button>*/}

                {/*<Divider type="vertical" />*/}
                {/*<Button*/}
                    {/*type="primary"*/}
                    {/*onClick={() => StoreOrder.getInvoice(record)}*/}
                {/*>*/}
                    {/*开票*/}
                {/*</Button>*/}

                {/*<Divider type="vertical" />*/}
                <Button
                    type="danger"
                    onClick={this.handleDele}
                >
                    删除
                </Button>
            </div>
        );
    }
    handleDele = () => {
        const {StoreOrder,record} = this.props;
        if (StoreOrder.userMessage.powerId === '2') {
            StoreOrder.updateInput(record,"delete")
        } else {
            alert('没有权限')
        }
    }
}

