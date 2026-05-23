import React,{Component} from 'react'
import {observer,inject} from 'mobx-react'

@inject('StorePro')
@observer
class Index extends Component{
    render(){
        const {StorePro,item} = this.props;
        return (
            <div className={"message_name"}>
                <p>
                    {item}
                </p>
                <div className="input_message">
                    <input
                        type="text"
                        placeholder={item}
                        name={item}
                        value={StorePro.InputBox[item]}
                        onChange={(e)=>StorePro.handleInputBoxInput(e.target.name,e.target.value)}
                    />
                </div>
            </div>
        )
    }
}

export default Index

