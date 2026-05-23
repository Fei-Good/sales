import React,{Component} from 'react'
import {observer,inject} from 'mobx-react'
// import Item from "../Element/Orders";
import { InputNumber } from "antd";

@inject('StoreOrder')
@observer
class DropDown extends Component{
    render(){
        const {StoreOrder,personType} = this.props;
        var person;
        if(personType === "成人"){
            person = "adultNum";
        }
        if(personType === "儿童"){
            person = "childNum";
        }
        if(personType === "人身意外"){
            person = "accidentNum";
        }
        return (
            <label className={"OrderItem"}>
                <span>
                    {personType}人数：
                </span>
                <div>
                    <InputNumber
                        min={0}
                        value=
                            {
                                (personType === "人身意外") ? (StoreOrder.InputBox.accidentNum) : (personType === "成人")?
                                    (StoreOrder.InputBox.adultNum):(StoreOrder.InputBox.childNum)
                            }
                        onChange={(value)=>StoreOrder.handleInputBoxInput(person,value)}
                    />
                    <span>
                        {
                            (personType === "人身意外") ? 7 : (personType === "成人")?
                                (StoreOrder.price.adultPrice):(StoreOrder.price.childPrice)
                        }
                        元/人
                    </span>
                </div>
            </label>
        )
    }
}

export default DropDown

