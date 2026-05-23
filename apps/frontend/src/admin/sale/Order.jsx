import React,{ Component,Fragment } from 'react'
import { observer,inject } from 'mobx-react';
import { Button } from 'antd';
import Printer from "../Element/printer/Printer"

export default
@inject('StoreOrder')
@observer
class Order extends Component{
    componentDidMount() {
        const { StoreOrder } = this.props;
        StoreOrder.reload();
    }

    render(){
        const { StoreOrder } = this.props;
        return (
            <Fragment>
                <div className={"header"}>
                    <span>
                        漂流后台管理系统
                    </span>
                    <Button
                        type="danger"
                        name=""
                        className="btn btn-success edit_id hello"
                        onClick={()=>StoreOrder.handleLoginOut()}
                    >
                        注销
                    </Button>
                    <span className={"hello"}>
                        欢迎你：
                        {StoreOrder.userMessage.username}
                    </span>
                </div>
                {this.props.children}

                <Printer />
            </Fragment>
        )
    }
}


