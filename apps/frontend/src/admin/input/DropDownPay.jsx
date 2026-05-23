import React,{Component} from 'react'
import {observer,inject} from 'mobx-react'

@inject('StoreOrder')
@observer
class DropDown extends Component{
    render(){
        const {StoreOrder,payType} = this.props;
        return (
            <label className={"OrderItem"}>
                <span >
                     {
                         payType === "payWay"?("选择付款方式："):("押金付款方式：")
                     }
                </span>
                <select
                    value = {
                        payType === "payWay"?(StoreOrder.InputBox.payWay):(StoreOrder.InputBox.depositePayWay)
                        // "微信"
                    }
                    onChange={(e)=>StoreOrder.handleInputBoxInput(payType,e.target.value)}
                >
                    <option value="现金">现金</option>
                    <option value="微信">微信</option>
                    <option value="支付宝">支付宝</option>
                </select>
            </label>
        )
    }
}

export default DropDown

