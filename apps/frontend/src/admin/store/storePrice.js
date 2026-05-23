import {observable,action} from "mobx";
import axios from "axios"
import {deepClone} from "../util/method";

class storeStore {
    constructor(){
        this.getPrice();
    }

    // -------------监视变量-------------//
    @observable data = [];
    @observable modalInputBox = false;
    @observable message = "";
    @observable InputBox = {
        _id:"",
        name:"",
        price:"",
    };
    pricebox = {};

    // -------------get-------------//
    @action
    getPrice=()=>{
        axios.get("/admin/price").then((res)=>{
            if (res.status === 200){
                this.pricebox = deepClone(res.data[0]);
                this.setPrice(res.data[0]);
            }
            else{
                console.log("error");
            }
        })
        .catch( (error)=>{
            console.log(error);
        })
    };
    @action
    inputUpdate=() =>{
        for (let i in this.pricebox) {
            if (i === this.InputBox.name) {
                this.pricebox[i] = this.InputBox.price;
            }
        }
        axios.post('/admin/updatePrice',this.pricebox)
            .then((res)=>{
                if (res.status === 200){
                    this.setmodalInputBox(false);

                    alert("提交成功");

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
    setPrice=(data)=>{
        let box = [];
        for( let i in data ){
            let Obj = {};
            if( i !== "_id"){
                Obj.name = i;
                Obj.price = data[i];
                Obj.key = new Date() + Math.random();
                switch (i) {
                    case "adultPrice" :Obj.ZHname = "成人票价";
                        break;
                    case "childPrice" :Obj.ZHname = "儿童票价";
                        break;
                    case "plupPrice" :Obj.ZHname = "浆板价格";
                        break;
                    case "clothPrice" :Obj.ZHname = "安全服价格";
                        break;
                    default:
                        break;
                }
                box.push(deepClone(Obj));
            }
        }
        this.data = box;
    };
    @action
    setmodalInputBox=(value)=>{
        this.initInput();
        this.modalInputBox = value;
    };
    @action
    setValue=(e)=>{
        if(/\D/g.test(e.target.value)){
            this.message = "请输入纯数字！";
        }
        else{
            this.message = "";
            this.InputBox[e.target.name] = e.target.value
        }
    };
    @action
    initInput=()=>{
        for(let i in this.InputBox) {
            this.InputBox[i] = "";
        }
        this.message = ""
    };

    @action
    updateInput=(record)=>{
        this.InputBox =  deepClone(record);
        this.modalInputBox = true;
    };

    @action
    setModaldele=(record)=>{
        this.InputBox =  deepClone(record);
        this.modalDele = true;
    };
    reLode=()=>{
        console.log("reload");
        this.getPrice()
    }
}
export default new storeStore()

