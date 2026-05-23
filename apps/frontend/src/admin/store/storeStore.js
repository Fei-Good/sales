import {observable,action} from "mobx";
import axios from "axios"
import {deepClone} from "../util/method";

class storeStore {
    constructor(){
        this.getStore();
    }

    // -------------监视变量-------------//
    @observable data = [];
    @observable modalInputBox = false;
    @observable modalInOut = false;
    @observable modalDele = false;
    @observable message = "";
    @observable InputBox = {
        _id:"",
        name:"",
        total:"",
    };
    @observable InputBoxing = "";

    // -------------get-------------//
    @action
    getStore=()=>{
        axios.get("/admin/getstore").then((res)=>{
            if (res.status === 200){
                this.setStore(res.data);
            }
            else{
                console.log("error");
            }
        })
        .catch(function (error) {
            console.log(error);
            // alert("提交失败")
        });
    };
    @action
    inputUpdate=() =>{
        let router;
        let box = deepClone(this.InputBox);
        if (this.InputBox._id === ""){
            router = '/admin/insertStore';
        }
        else{
            router = '/admin/updateStore';
            box.total = (this.InputBoxing==="add"?"":"-")+box.total;
        }
        axios.post(router,box)
            .then((res)=>{
                if (res.status === 200){
                    if (res.data.message){
                        this.setMessage(res.data.message);
                    }
                    else{
                        this.setmodalInputBox(false);
                        this.setModalInOut(false);
    //                    alert("提交成功");
                        this.reLode()
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
    deleteStore=()=>{
        axios.post("/admin/deleStore",this.InputBox)
            .then((res)=>{
                if (res.status === 200){
                    this.setDeleModal(false);
//                    alert("提交成功");
                    this.reLode()
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
    // -------------set-------------//
    @action
    setStore=(data)=>{
        let box = [];
        data.map((item)=>{
            item.key = new Date() + Math.random();
            box.push(item);
            return item.id
        });
        this.data = box;
    };
    @action
    setmodalInputBox=(value)=>{
        this.initInput();
        this.modalInputBox = value;
    };
    @action
    setValue=(e)=>{
        if (e.target.name === "total") {
            if(/\D/g.test(e.target.value)){
                this.setMessage("请输入纯数字！");
                return;
            }
            else{
                this.message = ""
            }
        }
        this.InputBox[e.target.name] = e.target.value
    };
    @action
    initInput=()=>{
        for(let i in this.InputBox) {
            this.InputBox[i] = "";
        }
        this.message = ""
    };
    @action
    setMessage=(value)=>{
        this.message = value;
    };
    @action
    setmodalInOut=(value)=>{
        this.modalInOut = value;
    };
    @action
    updateInput=(record,message)=>{
        this.InputBox =  deepClone(record);
        this.InputBox.total = 0;
        this.modalInOut = true;
        this.InputBoxing = message;
    };
    @action
    setModalInOut=(value)=>{
        this.initInput();
        this.modalInOut = value;
    };
    @action
    setModaldele=(record)=>{
        this.InputBox =  deepClone(record);
        this.modalDele = true;
    };
    @action
    setDeleModal=(value)=>{
        this.modalDele = value;
    };
    reLode=()=>{
        console.log("reload");
        this.getStore()
    }
}
export default new storeStore()

