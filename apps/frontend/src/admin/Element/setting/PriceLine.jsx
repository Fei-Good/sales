import { Button} from 'antd';
import React,{Component} from  'react';
import {inject, observer} from "mobx-react";

export default
@inject('StorePrice')
@observer
class OrderLine extends Component {
    render() {
        const {StorePrice,record} = this.props;
        return (
            <div>
                <Button
                    type="primary"
                    onClick={() => StorePrice.updateInput(record)}
                >
                    修改
                </Button>
                {/*<Divider type="vertical" />*/}
                {/*<Button*/}
                    {/*type="primary"*/}
                    {/*onClick={() => StorePrice.updateInput(record,"delete")}*/}
                {/*>*/}
                    {/*删除*/}
                {/*</Button>*/}
            </div>
        );
    }
}

