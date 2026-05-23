let deepClone=(v)=>{
    return JSON.parse(JSON.stringify(v));
};
let judgeDay = (a,b) =>{
    const abox = a[0].split("-");
    const abox1 = a[1].split("-");
    const bbox = b.split("-");
    for(let i = 0 ; i < 3 ;i++ ){
        if(parseInt(abox[i]) <= parseInt(bbox[i]) && parseInt(abox1[i]) >= parseInt(bbox[i])){
            if(parseInt(abox[i])===parseInt(bbox[i])&&parseInt(abox1[i])===parseInt(bbox[i])){
            }
            else{
                return true;
            }
        }
        else{
            return false;
        }

    }
    return true;
};

export {
    deepClone,
    judgeDay
}