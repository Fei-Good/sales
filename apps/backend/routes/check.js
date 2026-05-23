module.exports = {
    checkLogin: function checkLogin(req,res,next) {
        // console.log("not instert");
        if (!req.session.user){
            return res.send({isLogined:false});
        }
        else{
            console.log("not instert")
        }
        next();
    },
    checkNotLogin: function checkLogin(req,res,next) {
        console.log("instert");
        if (req.session.user){
            return res.send({isLogined:true});
        }
        next();
    },
};

