import  React,{Component} from "react"
import {inject, observer} from "mobx-react";
import { Select } from 'antd';
const Option = Select.Option;

export default
@inject('StoreOrder')
@observer
class SelectPlat extends Component {
    render() {
        const  { StoreOrder } = this.props;
        return (
            <Select
                defaultValue={StoreOrder.filterplat}
                style={{ width: 120 }}
                onChange={StoreOrder.setPlatFilter}
                value={StoreOrder.filterplat}
            >
                <Option value="各平台">各平台</Option>
                <Option value="现场">现场</Option>
                <Option value="美团">美团</Option>
                <Option value="红苹果">红苹果</Option>
                <Option value="驴妈妈">驴妈妈</Option>
                <Option value="云客赞">云客赞</Option>
                <Option value="其他">其他</Option>
            </Select>
        )
    }
}
