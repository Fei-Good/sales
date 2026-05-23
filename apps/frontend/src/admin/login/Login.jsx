import React,{ Component } from 'react';
import { inject, observer } from "mobx-react/index";
import { Spin } from 'antd';
import {
    Form, Icon, Input, Button, Checkbox,Radio,
} from 'antd';
const RadioGroup = Radio.Group;

@inject('StoreLogin')
@observer
class NormalLoginForm extends Component {
    componentDidMount() {
        const { StoreLogin } = this.props;
        StoreLogin.initStore();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { StoreLogin } = this.props;
        return (
            <div className="page">
                <div className={"body_container"}>
                    <p className="firm_title">
                        管理员后台管理系统
                    </p>
                    <Spin spinning={StoreLogin.isLoading} delay={500}>
                        <div className="login_box">
                            <p className="item">
                                登录
                            </p>
                            <Form
                                className="login-form"
                            >
                                <Form.Item>
                                    {getFieldDecorator('userName', {
                                        rules: [{ required: true, message: 'Please input your username!' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="Username"
                                            className="username"
                                            required="required"
                                            type="text"
                                            name="inputName"
                                            onChange={(e)=>{StoreLogin.loginInputBoxInput("inputName",e.target.value)}}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: 'Please input your Password!' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            type="password"
                                            placeholder="Password"
                                            required="required"
                                            name="inputPassword"
                                            onChange={(e)=>{StoreLogin.loginInputBoxInput("inputPassword",e.target.value)}}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <RadioGroup
                                        onChange={(e)=>{StoreLogin.loginInputBoxInput("powerId",e.target.value)}}
                                        defaultValue={"1"}
                                    >
                                        <Radio value={"1"} default>
                                            管理员
                                        </Radio>
                                        <Radio value={"2"}>
                                            超级管理员
                                        </Radio>
                                    </RadioGroup>
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('remember', {
                                        valuePropName: 'checked',
                                        initialValue: true,
                                    })(
                                        <Checkbox>记住我</Checkbox>
                                    )}
                                    <span className={"message"}>
                                        {StoreLogin.message}
                                    </span>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        block
                                        id="my_submit"
                                        onClick={()=>{StoreLogin.handleLogin()}}
                                    >
                                        登录
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Spin>
                </div>
            </div>
        );
    }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
export default WrappedNormalLoginForm
