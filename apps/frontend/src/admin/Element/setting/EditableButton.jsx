import {Button} from "antd";
import React,{Component} from "react";
import {inject,observer} from "mobx-react/custom";
const EditableContext = React.createContext();

export default
@inject("StoreThings")
@observer
class EditableButton extends Component{
    render(){
        const {StoreThings,record} = this.props;
        return (
            <div>
                {StoreThings.isEditing(record) ? (
                    <span>
                      <EditableContext.Consumer>
                        {form => (
                            <Button
                                type={"primary"}
                                onClick={() => StoreThings.save(form, record.key)}
                                style={{ marginRight: 8 }}
                            >
                                保存
                            </Button>
                        )}
                      </EditableContext.Consumer>
                        <Button
                            onClick={() => StoreThings.cancel(record.key)}
                            type={"primary"}
                        >
                            取消
                        </Button>
                    </span>
                ) : (
                    <Button
                        type={"primary"}
                        disabled={StoreThings.editingKey !== ''}
                        onClick={() => StoreThings.edit(record.key)}
                    >
                        编辑
                    </Button>
                )}
            </div>
        )
    }
}



