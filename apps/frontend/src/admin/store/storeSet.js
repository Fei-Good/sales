import { observable,action } from "mobx";
import axios from 'axios';
import {deepClone} from "../util/method";

class StoreLogin {
    constructor(){
        this.getUsers();
    }
    @observable users = [];
    @observable userBox = {
        _id:"",
        username:"",
        password:"",
        orders:"",
        powerId: ""
    };

    @observable usersModal = false;
    @observable deleModal = false;
    @observable usersMessage = "";

    @action
    addUser=()=>{
        let router;
        if (this.userBox._id === ""){
            this.userBox.powerId = "1";
            router = '/admin/insertuser';
        }
        else{
            router = '/admin/updateuser';
        }
        console.log(router,this.userBox)
        axios.post(router,this.userBox)
            .then((res)=>{
                if (res.status === 200){
                    if (res.data.message){
                        this.setUsersMessage(res.data.message)
                    }
                    else{
                        this.setUsersModal(false);
    //                    alert("提交成功");
                        this.getUsers()
                    }
                }
                else {
                    console.log("error")
                }
            })
            .catch(function (error) {
                console.log(error);
                // alert("提交失败")
            });
    };
    @action
    setUsersMessage=(value)=>{
        this.usersMessage = value;
    };
    @action
    setUsersModal=(value)=>{
        this.usersModal = value;
    };
    @action
    setDeleModal=(value)=>{
        this.deleModal = value;
    };
    @action
    getUsers=()=>{
        let router = '/admin/users';
        axios.get(router)
            .then((res)=>{
                if (res.status === 200){
                    this.setUsers(res.data)
                }
                else {
                    console.log("error")
                }
            })
            .catch( (error)=>{
                console.log(error);
            });
    };
    @action
    setUsers=(data=[])=>{
        let box = [];
        data.map((item)=>{
            item.key = new Date() + Math.random();
            box.push(item);
            // console.log(item);
            return item.id
        });
        this.users.replace(box)
    };
    @action
    newOrder=()=>{
        this.initInput();
        this.usersModal = true;
    };
    @action
    initInput=()=>{
        this.userBox._id= "";
        this.userBox.username= "";
        this.userBox.password= "";
        this.userBox.orders= 0;
        this.userBox.powerId= 1;
        this.usersMessage = "";
    };
    @action
    updateInput=(record,tag)=>{
        this.initInput();
        console.log(record)
        this.userBox =  deepClone(record);
        if (tag === "repaire") {
            this.usersModal = true;
        }
        else if(tag === "delete"){
            // console.log("hello");
            this.deleModal = true;
        }
    };
    @action
    updateUsername=(e)=>{
        this.userBox.username = e.target.value;
    };
    @action
    updatePassword=(e)=>{
        this.userBox.password = e.target.value;
    };
    @action
    handleDelete=()=>{
        axios.post("/admin/deleteuser",this.userBox)
            .then((res)=>{
                if (res.status === 200){
                    this.setDeleModal(false);
//                    alert("提交成功");
                    this.getUsers()
                }
                else {
                    console.log("error")
                }
            })
            .catch(function (error) {
                console.log(error);
                // alert("提交失败")
            });
    };

    setFilish=()=>{
        window.location.hash = "#/order";
    };
}
export default new StoreLogin();


