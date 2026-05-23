import React,{Component} from 'react'
import {observer,inject} from 'mobx-react'


@inject('StoreOrder')
@observer
class Input extends Component{
    render(){
        const {StoreOrder}=this.props;
        return(
            <div className="modal fade" id="myModalDelete">
                <div className="modal-dialog">
                    <div className="modal-content">
                        {/*// <!-- 模态框头部 -->*/}
                        <div className="modal-header">
                            <h4 className="modal-title">
                                确认删除？
                            </h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        {/*// <!-- 模态框主体 -->*/}
                        <div className="modal-body">
                            <div className="message_box">
                                <form
                                    id="my_form"
                                    className="message_form"
                                    method="post"
                                >
                                    <div className={"message_name"}>
                                        订单编号:
                                    </div>
                                    <div className="input_message">
                                        {StoreOrder.InputBox.orderNum}
                                    </div>

                                    <div className={"message_name"}>
                                        支付方式:
                                    </div>
                                    <div className="input_message">
                                        {StoreOrder.InputBox.payWay}
                                    </div>

                                    <div className={"message_name"}>
                                        总计:
                                    </div>
                                    <div className="input_message">
                                        {StoreOrder.InputBox.totalMoney}
                                    </div>

                                    <div className="btn_item message_btn">
                                        <button
                                            id="my_submit"
                                            type="button"
                                            className="button login_in"
                                            onClick={StoreOrder.handleDelete}
                                            data-dismiss="modal"
                                        >
                                            删除
                                        </button>
                                        <button
                                            type="button"
                                            className="button"
                                            data-dismiss="modal"
                                        >
                                            取消
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Input;
