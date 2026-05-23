import { observable,action } from "mobx";
import axios from 'axios';

class StoreLogin {
    constructor(){
        this.message = "";
        this.isLoading = false;
    }
    @observable loginInputBox = {
        inputName: '',
        inputPassword: '',
        powerId: '1',
    };

    @observable message;
    @observable isLoading = false;

    // ----------------数据库操作------------------//
    @action
    handleLogin=()=>{
        this.setIsLoading(true);
        axios.post('/admin/login',this.loginInputBox)
            .then((res)=>{
                this.setIsLoading(false);
                if (res.data.isLogined === true){
                    this.setId(this.loginInputBox.powerId);
                    window.location.hash = "#/order";
                }
                else if (res.data.isLogined === false){
                    this.setMessage("密码错误或无此用户");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    isAdmin = (nextState, replaceState, cd) =>{
        axios.get('/admin/checkLogin')
            .then((res)=>{
                if (!res.data.isLogined){
                    replaceState({ pathname: '/login' });
                    cd();
                }
                else{
                    cd();
                }
            })
    };

    // ----------------set------------------//
    @action
    loginInputBoxInput=(key,value)=>{
        this.loginInputBox[key]=value;
    };
    @action
    setIsLoading=(value)=>{
        this.isLoading=value;
    };
    @action
    setId = (value) => {
        this.powerId = value;
    };
    @action
    setIsloading = (value) => {
        this.isLoading = value;
    };
    @action
    setMessage = (value) => {
        this.message = value;
    };
    @action
    initStore=()=>{
        this.loginInputBox.inputName = '';
        this.loginInputBox.inputPassword = '';
        this.loginInputBox.powerId = '1';
    };
}
export default new StoreLogin();


