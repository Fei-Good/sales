import React,{Component} from 'react'
import {observer,inject} from 'mobx-react'
import Image from "../Element/history/Image";
import Textarea from "../Element/history/Textarea";
import ItemInput from "./ItemInput";

@inject('StorePro')
@observer
class Input extends Component{
    render(){
        const {StorePro}=this.props;
        return(
            <div className="modal fade" id="myModalPro">
                <div className="modal-dialog">
                    <div className="modal-content">
                        {/*// <!-- 模态框头部 -->*/}
                        <div className="modal-header">
                            <h4 className="modal-title">
                                新的Project
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
                                    encType={"multipart/form-data"}
                                >
                                    <Image />

                                    <Textarea item={"item"}/>
                                    <ItemInput item={"Advisor"}/>
                                    <ItemInput item={"ProgramLeader"}/>
                                    <ItemInput item={"ProgramMembers"}/>

                                    <ItemInput item={"oneOrderLink"}/>
                                    <ItemInput item={"PDFLink"}/>
                                    <ItemInput item={"PosterLink"}/>
                                    <ItemInput item={"VideoLink"}/>

                                    <div className="btn_item message_btn">
                                        <button
                                            id="my_submit"
                                            type="button"
                                            className="button login_in"
                                            onClick={StorePro.insertOne}
                                            data-dismiss="modal"
                                        >
                                            提交
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
