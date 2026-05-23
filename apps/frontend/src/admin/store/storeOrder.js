import {action, computed, configure, observable} from 'mobx'
import axios from 'axios' //发送ajax 请求
import { message } from 'antd';
import { deepClone } from "../util/method.js"

//----------------严格模式-------------------//
configure({ enforceActions: "observed" });
const moment = require('moment');
const fileBaseUrl = process.env.REACT_APP_FILE_BASE_URL || window.location.origin;

class StoreOrder {
    constructor() {
        this.getSaler();
        this.getOrders();
        this.getPrice();
        this.initInput();
    }
    @observable store = [];
    @observable orders = [];
    @observable InputBox = {
        _id:"",
        time:"",
        orderNum: "",
        platform: "",
        payWay: "",//票价
        depositePayWay: "",//押金
        adultNum: "",
        childNum: "",
        accidentNum: "",
        totalMoney: "",
        isReback: "",
        ifFinish: "",
        saler:"",
        phoneNumber:""
    };
    @observable userMessage = {
        username: '',
        powerId: '1',
    };
    @observable price = {
        _id:"",
        adultPrice: 80,
        childPrice: 40,
        plupPrice: 50,
        clothPrice: 30
    };
    @observable activeClass = "ing";
    @observable show = true;
    @observable saler = "";
    @observable modalInputBox = false;
    @observable deleModal = false;
    @observable filterNum = 0;
    @observable addPhoneMessage = "";

    //filter
    @observable filterStr = "all";
    @observable filterTime = [];
    @observable filterplat = "各平台";
    @observable inputSearch = "";
    @observable Searching = false;

    //get
    @computed get ordersLength(){
        return this.orders.length;
    };
    @computed get fiter(){
        return this.orders.filter((item)=>{
            // if (this.filterStr !== "all" && item.ifFinish !== this.filterStr){
            //     return false;
            // }
            let timebox = this.filterTime.slice();
            let startTime = moment(timebox[0]).format("YYYY-MM-DD");
            let endTime = moment(timebox[1]).format("YYYY-MM-DD");
            if (this.filterTime.length >= 2
                &&!moment(startTime).isSame(item.time)
                &&!moment(endTime).isSame(item.time)
                &&!moment(item.time).isBetween(startTime, endTime)
            )
            {
                return false;
            }
            if ( this.filterplat !== "各平台" && item.platform !== this.filterplat) {
                if (this.filterplat === "其他"){
                    if  (item.platform !== "现场"
                        && item.platform !== "美团"
                        && item.platform !== "红苹果"
                        && item.platform !== "驴妈妈"
                        && item.platform !== "云客赞"
                    ){
                        return true;
                    }
                }
                return false;
            }
            if (this.inputSearch !== "" && item.orderNum !== this.inputSearch){
                if (this.Searching){
                    return false;
                }
            }
            return true;
        });
    };
    @computed get perserTotall(){
        let box = 0;
        for (let i = 0 ;i < this.fiter.length ;i++){
            box += this.fiter[i].childNum?this.fiter[i].childNum:0;
            box += this.fiter[i].adultNum?this.fiter[i].adultNum:0;
        }
        return box
    }
    @computed get perserTotallAdult(){
        let box = 0;
        for (let i = 0 ;i < this.fiter.length ;i++){
            box += this.fiter[i].adultNum?this.fiter[i].adultNum:0;
        }
        return box
    }
    @computed get perserTotallChildren(){
        let box = 0;
        for (let i = 0 ;i < this.fiter.length ;i++){
            box += this.fiter[i].childNum?this.fiter[i].childNum:0;
        }
        return box
    }

    @action
    handleInputBoxInput=(key,value)=>{
        this.InputBox[key]=value;
        this.InputBox.totalMoney =
        Number(this.InputBox.adultNum)*Number(this.price.adultPrice)
        + Number(this.InputBox.accidentNum)*Number(7)
        + Number(this.InputBox.childNum)*Number(this.price.childPrice)
        + this.InputBox.deposite
    };
    @action
    addOneOrders=(item)=>{
        this.orders.push(item)
    };
    @action
    setOrders=(data)=>{
        let box = [];
        data.filter(Boolean).map((item)=>{
            item.key = new Date() + Math.random();
            item.personNum = parseInt(item.childNum) + parseInt(item.adultNum);
            box.push(item);
            return item.id;
        });
        this.orders.replace(box);
    };

    @action
    getOrders=(e)=>{
        let router = '/admin/Data';
        axios.get(router)
            .then((res)=>{
                if (res.status === 200){
                    this.setOrders(res.data)
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
    getPrice=()=>{
        axios.get( '/admin/price')
            .then((res)=>{
                if (res.status === 200){
                    this.setPrice(res.data[0]);
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
    setmodalInputBox=(values)=>{
        // this.initInput();
        this.modalInputBox = values;
    };
    @action
    newOrder=()=>{
        this.initInput();
        this.setmodalInputBox(true);
    };
    @action
    setDeleModal=(values)=>{
        this.deleModal = values;
    };
    @action
    setPrice=(item)=>{
        this.price = item ? item : this.Price;
    };
    @action
    setSaler=(value)=>{
        this.saler=value;
    };
    @action
    getSaler=()=>{
        axios.get( '/admin/getSaler')
            .then((res)=>{
                if (res.status === 200){
                    this.setSaler(res.data.username);
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
    initInput=()=>{
        for(let i in this.InputBox) {
                this.InputBox[i] = 0;
        }
        this.InputBox._id = "";
        this.InputBox.isReback = "false";
        this.InputBox.ifFinish = "ing";
        this.InputBox.saler = this.saler;
        this.InputBox.platform = "现场";
        this.InputBox.payWay = "现金";
        this.InputBox.depositePayWay = "现金";
        this.InputBox.phoneNumber = "";
        this.InputBox.deposite = 100;
        this.InputBox.totalMoney = 100;
        this.InputBox.time = moment(Date.now()).format("YYYY-MM-DD");
        this.InputBox.isReback = "true";
    };
    @action
    updateInput=(record,tag)=>{
        this.InputBox =  deepClone(record);
        if (tag === "repaire") {
            this.modalInputBox = true;
        }
        else if(tag === "delete"){
            this.deleModal = true;
        }
    };
    @action
    setIsReback=(e)=>{
        this.InputBox.isReback = e.target.checked?"true":"false";
        this.InputBox.ifFinish = e.target.checked?"ed":"ing";
    };
    @action
    setFilter=(value)=>{
        this.filterNum = value;
    };
    @action
    writeSearch=(e)=>{
        this.inputSearch = e.target.value;
    };
    @action
    setPhoneInput=(e)=>{
        if(/\D/g.test(e.target.value)){
            this.addPhoneMessage = "请输入纯数字！";
        }
        else{
            this.addPhoneMessage = "";
            this.InputBox[e.target.name] = e.target.value;
        }
    };

    getInvoice=(record)=>{
        axios.post("/admin/initPdf",record)
            .then((res)=>{
                if (res.status === 200){
                    // window.open("http://47.107.70.36/pdf/pdf"+this.userMessage.username+".pdf","_blank");
                    window.open(fileBaseUrl+"/pdf/pdf"+this.userMessage.username+".pdf","_blank");
                    console.log("ok");
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
    //数据交互
    @action
    inputUpdate=() =>{
        let router;
        if (this.InputBox._id === ""){
            router = '/admin/insertoneOrder';
            // 打印
            if (window.myPreview1 && process.env.NODE_ENV !== "development") {
                window.myPreview1()
            }
        }
        else{
            router = '/admin/updateoneOrder';
        }
        axios.post(router, { 
            accidentNum: this.InputBox.accidentNum,
            adultNum: this.InputBox.adultNum,
            childNum: this.InputBox.childNum,
            deposite: this.InputBox.deposite,
            depositePayWay: this.InputBox.depositePayWay,
            ifFinish: this.InputBox.ifFinish,
            isReback: this.InputBox.isReback,
            orderNum: this.InputBox.orderNum,
            payWay: this.InputBox.payWay,
            phoneNumber: '',
            platform: this.InputBox.platform,
            saler: this.InputBox.saler,
            time: this.InputBox.time,
            totalMoney: this.InputBox.totalMoney,
            _id: this.InputBox._id,
         })
            .then((res)=>{
                if (res.status === 200){
                    this.setmodalInputBox(false);
                    message.success('提交成功');
                    // this.reload()
                    // console.log(res)
                    var box = this.orders.slice()
                    box.splice(0, 0, res.data.result)
                    this.setOrders(box)
                    this.getPrice();
                    this.getUerMessage()
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
    handleDelete=()=>{
        this.setDeleModal(false);
        axios.post('/admin/deleteOne',this.InputBox)
            .then((res)=>{
                if (res.status === 200){
                    message.success('删除成功');
                    this.reload()
                }
                else {
                    console.log("error")
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    handleLoginOut=()=>{
        axios.get('/admin/LoginOut')
            .then((res)=>{
                if (res.status === 200){
                    alert("注销成功");
                    window.location.hash = "#/"
                }
                else {
                    console.log("error")
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    reload=()=>{
        let e = "all";
        this.getOrders(e);
        this.getPrice();
        this.getUerMessage()
    };
    getClassName=(e)=>{
        if(this.activeClass === e){
            return " linkActive"
        }
        else {
            return ""
        }
    };
    getUerMessage=()=>{
        axios.get('/admin/userMessage').then((res)=>{
            if(res.status === 200){
                this.setUserMessage(res.data)
            }
            else{
                console.log("error")
            }
        })
        .catch( (error)=>{
            console.log(error);
        });
    };

    @action
    setUserMessage=(data)=>{
        this.userMessage = deepClone(data)
    };

    getword=()=>{
        // this.downloadFile("http://47.107.70.36/word/addblackout.docx");
        // this.downloadFile("window.location.origin/word/addbuleout.docx");
        // this.downloadFile("http://47.107.70.36/word/addRedout.docx");
        // this.downloadFile("http://47.107.70.36/word/addYellowout.docx");
        window.open(fileBaseUrl+"/word/白票out.docx","_self");
        setTimeout(()=>{
            window.open(fileBaseUrl+"/word/红票out.docx","_self");
        },500);
        setTimeout(()=>{
            window.open(fileBaseUrl+"/word/黄票out.docx","_self");
        },1000);
    };
    downloadFile=(url)=>{
        try{
            var elemIF = document.createElement("iframe");
            elemIF.src = url;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }catch(e){
            console.log(JSON.stringify(e))
        }
    };

    // fiter方法
    @action
    setFilishFilter=(key)=>{
        this.filterStr = key;
    };
    @action
    setTimefilter=(dates)=>{
        this.filterTime = dates;
    };
    @action
    setPlatFilter=(values)=>{
        this.filterplat = values;
    };
    @action
    setInputSearch=(values)=>{
        this.inputSearch = values;
        this.Searching = true;
    };
    @action
    setInitFilter=()=>{
        this.filterStr = "all";
        this.filterTime = [];
        this.filterplat = "各平台";
        this.inputSearch = "";
    };
}
export default new StoreOrder();
