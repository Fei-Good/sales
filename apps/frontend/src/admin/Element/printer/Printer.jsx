import {inject, observer} from "mobx-react";
import React,{Component} from "react";
// import moment from "moment"
import { deepClone } from "../../util/method.js"

// style={{display: "none"}}
export default
@inject('StoreOrder')
@observer
class Printer extends Component{
    render() {
        const { StoreOrder } = this.props;
        let Message = deepClone(StoreOrder.InputBox);
        Message.adultPrice = StoreOrder.price.adultPrice;
        Message.totalLow =
            Number(StoreOrder.InputBox.adultNum)*Number(StoreOrder.price.adultPrice)
            + Number(StoreOrder.InputBox.childNum)*Number(StoreOrder.price.childPrice)
            + Number(StoreOrder.InputBox.accidentNum)*Number(7);
        // 打印输出
        try {
            Message.time = Message.time.split("-");
        }
        catch (e) {
            Message.time = [0,0,0];
            console.log(e)
        }
        let inputMessage = {
            time: Message.time[0]+"年"+Message.time[1]+"月"+Message.time[2]+"日",
            adultPrice:Message.adultPrice,
            personAll:Number(Message.adultNum)+Number(Message.childNum),
            totalLow:Message.totalLow,
            childNum:Message.childNum,
            adultNum:Message.adultNum,
            accidentNum: Message.accidentNum,
            cloth:Number(Message.adultNum)+Number(Message.childNum),
            plup:Message.adultNum,
            totalUp:Message.totalMoney,
            phone:Message.phoneNumber,
        };
        return (
            <form id="form1" style={{display: "none"}}>
                <table style={{borderCollapse:"collapse" }}>
                    <tbody>
                    <tr>
                        <td colSpan="7"
                            style={{
                                height: "70px",
                                border: "none",
                                textAlign: "center",
                                fontSize: "20px",
                                fontWeight: "500"
                            }}>
                            青城两河漂流门票
                            <span style={{
                                fontSize: "15px",
                                position:"relative",
                                top:"26px",
                                left:"50px"
                            }}>
                                {inputMessage.time}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            票据种类：
                        </td>
                        <td>
                            {/*下段漂流票*/}
                            {Message.platform}
                        </td>
                        <td>
                            价格
                        </td>
                        <td colSpan="3">
                            {
                                Message.platform!=="现场"?
                                0:
                                (
                                    <span style={{margin: "0 100px 0 0"}}>
                                        {inputMessage.adultPrice}
                                            元
                                    </span>
                                )
                            }
                        </td>
                        <td rowSpan="6" style={{border: "none",width: "130px"}}>
                            <div>
                            <span>
                                *凭漂流票领取生衣船桨各一套:儿童无桨
                            </span>
                                <br/>
                                <span>
                                *漂流完成后到装备领取处退还所领物品，检查完好无误后，到购票处退还押金
                            </span>
                                <br/>
                                <span>
                                *本卷当日有效
                            </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            人数：
                        </td>
                        <td>
                            <span>
                                {inputMessage.personAll}
                            </span>
                            人
                        </td>
                        <td>
                            小计票价：
                        </td>
                        <td colSpan="3">
                            {
                                Message.platform!=="现场"?
                                0:
                                (
                                    <span style={{margin: "0 100px 0 0"}}>
                                        {inputMessage.totalLow}
                                        元
                                    </span>
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            成人数量：
                        </td>
                        <td>
                            <span>
                                {inputMessage.adultNum}
                            </span>
                            人
                        </td>
                        <td>
                            儿童数量：
                        </td>
                        <td colSpan="3">
                            <span>
                                {inputMessage.childNum}
                            </span>
                            <span style={{margin: "0 100px 0 0"}}>
                                人
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            押金：
                        </td>
                        <td>
                            100元
                        </td>
                        <td>
                            安全服：
                        </td>
                        <td>
                            <span>
                                {inputMessage.cloth}
                            </span>
                        </td>
                        <td>
                            浆板：
                        </td>
                        <td>
                            <span>
                                {inputMessage.plup}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            合计大写：
                        </td>
                        <td colSpan="2" style={{textAlign: "left",}}>
                            <span>
                                {
                                    Message.platform !== "现场"?
                                        Message.deposite:inputMessage.totalUp
                                }
                            </span>
                        </td>
                        <td style={{textAlign: "left",}}>
                            <span>
                                人身意外保险
                            </span>
                        </td>
                        <td colSpan="2" style={{textAlign: "left",}}>
                            <span>
                            {Message.accidentNum}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            联系方式：
                        </td>
                        <td colSpan="5" style={{textAlign: "left",}}>
                            <span>
                                {inputMessage.phone}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td style={{borderRight:'none',borderBottom:'none'}} colSpan="6">
                            说明：1、白色联还装备和押金使用；2、粉色联领取装备使用；3、黄色联流入口使用
                            <br/>
                            谨记：请切记保管好白色联勿丢失,破损将影响你的押金还记:经售出,概不退票,手工涂改本票作废,当日有效
                        </td>
                    </tr>
                    </tbody>

                </table>
            </form>
        )
    }
}