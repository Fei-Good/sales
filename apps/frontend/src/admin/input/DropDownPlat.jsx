import React,{Component} from 'react'
import {observer,inject} from 'mobx-react'
import {Input} from "antd";

@inject('StoreOrder')
@observer
class DropDownPlat extends Component{
    render(){
        const {StoreOrder} = this.props;
        return (
            <label className={"OrderItem"}>
                <span>
                    选择购票平台：
                </span>
                {
                    StoreOrder.InputBox.platform === "现场"||
                    StoreOrder.InputBox.platform === "美团"||
                    StoreOrder.InputBox.platform === "云客赞"||
                    StoreOrder.InputBox.platform === "驴妈妈"||
                    StoreOrder.InputBox.platform === "红苹果"?
                    <select
                        value={StoreOrder.InputBox.platform}
                        onChange={(e)=>StoreOrder.handleInputBoxInput("platform",e.target.value)}
                    >
                        <option value="现场">现场</option>
                        <option value="美团">美团</option>
                        <option value="红苹果">红苹果</option>
                        <option value="驴妈妈">驴妈妈</option>
                        <option value="云客赞">云客赞</option>
                        <option value="其他">其他</option>
                    </select>
                    :
                    <span>
                        <Input
                            value={StoreOrder.InputBox.platform}
                            onChange={(e)=>StoreOrder.handleInputBoxInput("platform",e.target.value)}
                            width={100}
                        />
                    </span>
                }
            </label>
        )
    }
}

export default DropDownPlat

