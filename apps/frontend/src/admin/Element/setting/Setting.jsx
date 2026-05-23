import  React,{Component} from "react"
import Userset from "./Userset"
import Priceset from "./Priceset"
import SmallShop from "../SmallShop"


export default
class MyTable extends Component{
    render() {
        return (
            <div>
                <Userset />
                <Priceset />
                <SmallShop />
            </div>
        )
    }
}


