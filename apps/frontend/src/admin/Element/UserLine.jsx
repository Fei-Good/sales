import { Button, Divider} from 'antd';
import React,{Component} from  'react';
import {inject, observer} from "mobx-react";

export default
@inject('StoreSet')
@observer
class OrderLine extends Component {
    render() {
        const {StoreSet,record} = this.props;
        return (
            <div>
                <Button
                    type="primary"
                    onClick={() => StoreSet.updateInput(record,"repaire")}
                >
                    修改
                </Button>
                <Divider type="vertical" />
                <Button
                    type="primary"
                    onClick={() => StoreSet.updateInput(record,"delete")}
                >
                    删除
                </Button>
            </div>
        );
    }
}

