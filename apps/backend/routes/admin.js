const router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const checkLogin = require('./check').checkLogin;
const getPdf = require("../pdf/pdfKit.js");
const config = require('../config/default')

let sales;
let users;
let price;
let store;

MongoClient.connect(config.mongodb, function (err, client) {
    if (err) throw err;
    console.log(client.db('sales'))
    sales  = client.db('sales').collection('order');
    users  = client.db('sales').collection('user');
    price  = client.db('sales').collection('price');
    store  = client.db('sales').collection('store');
});

// ----------------order--------------//
router.get('/Data', function (req, res) {
    let box = {
       
    };
    if (req.session.powerId !== "2") {
        box.saler = req.session.user
    }
    sales.find(box).toArray(function (err, result) {
        if (err) throw err;
        res.json(result.reverse());
    })
});
router.get('/price', function (req, res) {
    price.find().toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    })
});
router.post('/updateoneOrder', checkLogin, function (req, res) {
    let _id = mongoose.Types.ObjectId(req.body._id);
    let box = req.body;
    delete box._id;
    sales.updateOne({_id:_id}, { $set: box} , function(err) {
        if (err) throw err;
        console.log("1 document updateOne");
    });
    res.sendStatus(200);
});
router.post('/deleteOne', checkLogin, function (req, res) {
    let _id = mongoose.Types.ObjectId(req.body._id);
    let box = req.body;
    delete box._id;
    sales.deleteOne({_id:_id} , function(err) {
        if (err) throw err;
        console.log("1 document delete");
    });
    res.sendStatus(200);
});
router.post('/insertoneOrder', checkLogin, function (req, res) {
    let box = req.body;
    delete box._id;
    box.saler = req.session.user;
    users.find({username:box.saler}).toArray(function (err, result) {
        box.orderNum = box.time+ "-" + box.saler + "-"  + (++result[0].orders);
        sales.insertOne(box, function(err, result) {
            if (err) throw err;
            console.log("1 document inserted", result);
            if (result.insertedId) {
                res.send({
			result: { ...box, _id: result.insertedId }
		})
                return
            }
            res.sendStatus(200);
        });

        let _id = mongoose.Types.ObjectId(result[0]._id);
        delete result[0]._id;
        users.updateOne({_id:_id}, { $set: result[0] } , function(err) {
            if (err) throw err;
            console.log("user 1 document updateOne");
        });
    });
});
router.post('/initPdf', checkLogin, function (req, res) {
        let box = req.body;
        let inputMessage = {
            time:box.time,
            adultPrice:box.adultPrice,
            personAll:parseInt(box.adultNum)+parseInt(box.childNum),
            totalLow:box.totalLow,
            childNum:box.childNum,
            adultNum:box.adultNum,
            cloth:parseInt(box.adultNum)+parseInt(box.childNum),
            plup:box.adultNum,
            totalUp:box.totalMoney,
            phone:box.phoneNumber,
        };
        getPdf.getPdf(inputMessage,req.session.user);
        res.sendStatus(200);
});

//-------------------login-------------------//
router.post('/login', function (req, res) {
    users.find().toArray(function (err, result) {
        if (err) throw err;
        let conSo =  result.find(function(item){
            return item.username === req.body.inputName && item.powerId === req.body.powerId && item.password === req.body.inputPassword;
        });
        if (conSo){
            req.session.user = conSo.username;
            req.session.powerId = conSo.powerId;
            res.send({isLogined:true});
        }
        else{
            res.send({isLogined:false});
        }
    });
});
router.get('/loginOut', function (req, res) {
    // req.session.user = null;
    req.session.destroy();
    // res.redirect('/')
    res.sendStatus(200);
});
router.get('/getSaler', function (req, res) {
    // res.send({username:req.session.user});
    users.find({username:req.session.user}).toArray(function (err, result) {
        if (err) throw err;
        res.json(result[0]);
    })
});
router.get('/userMessage', function (req, res) {
    // res.send({username:req.session.user});
    users.find({username:req.session.user}).toArray(function (err, result) {
        if (err) throw err;
        if (result.length !== 0){
            let box={};
            box.username = result[0].username;
            box.powerId = result[0].powerId;
            res.json(box);
        }
        else {
            res.sendStatus(404);
        }
    })
});

// ------------------user-setting----------------//
router.get('/users', function (req, res) {
    users.find().toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    })
});
router.post('/deleteuser', checkLogin, function (req, res) {
    let _id = mongoose.Types.ObjectId(req.body._id);
    let box = req.body;
    delete box._id;
    if (box.powerId === "2") {
        res.send({message:"无法删除本用户名"});
    }
    else {
        users.deleteOne({_id:_id} , function(err) {
            if (err) throw err;
            console.log("1 document delete");
        });
        res.sendStatus(200);
    }
});
router.post('/insertuser', checkLogin, function (req, res) {
    let box = req.body;
    delete box._id;
    users.find().toArray(function (err, result) {
        if (err) throw err;
        let conSo =  result.find(function(item){
            return item.username === box.username;
        });
        if (conSo){
            res.send({message:"用户名号被注册了"});
        }
        else{
            users.insert(box, function(err) {
                if (err) throw err;
                console.log("1 document inserted");
            });
            res.sendStatus(200);
        }
    });
});
router.post('/updateuser', checkLogin, function (req, res) {
    let box = req.body;
    let id = mongoose.Types.ObjectId(box._id);
    delete box._id;
    users.updateOne({_id:id}, { $set:box}, function(err) {
        if (err) throw err;
        console.log("1 document inserted");
    });
    res.sendStatus(200);
});

// ------------------setPrice---------------//
router.post('/setprice', checkLogin, function (req, res) {
    let box = req.body;
    price.insert(box, function(err) {
        if (err) throw err;
        console.log("1 document inserted");
    });
    res.sendStatus(200);
});
router.post('/updatePrice', checkLogin, function (req, res) {
    let box = req.body;
    let id = mongoose.Types.ObjectId(box._id);
    delete box._id;
    price.updateOne({_id:id}, { $set:box}, function(err) {
        if (err) throw err;
        console.log("1 document inserted");
    });
    res.sendStatus(200);
});

// ------------------Store----------------//
router.get('/getstore', function (req, res) {
    store.find().toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    })
});
router.post('/insertStore', checkLogin, function (req, res) {
    let box = req.body;
    delete box._id;
    store.find().toArray((err, result) =>{
        if (err) throw err;
        let conSo =  result.find(function(item){
            return item.name === box.name;
        });
        if (conSo){
            res.send({message:"有相同的物品了"});
        }
        else{
            store.insert(box, function(err) {
                if (err) throw err;
                console.log("1 document inserted");
            });
            res.sendStatus(200);
        }
    });
});
router.post('/updateStore', checkLogin, function (req, res) {
    let box = req.body;
    let id = mongoose.Types.ObjectId(box._id);
    delete box._id;
    store.find({_id:id}).toArray((err, result) =>{
        if (err) throw err;
        box.total = parseInt(result[0].total)+parseInt(box.total);
        store.updateOne({_id:id},{ $set:box}, function(err) {
            if (err) throw err;
            console.log("1 document inserted");
        });
    });
    res.sendStatus(200);
});
router.post('/deleStore', checkLogin, function (req, res) {
    let _id = mongoose.Types.ObjectId(req.body._id);
    let box = req.body;
    delete box._id;
    store.deleteOne({_id:_id} , function(err) {
        if (err) throw err;
        console.log("1 document delete");
    });
    res.sendStatus(200);
});

// ----------------checkLogin----------------//
router.get('/checkLogin', function (req, res) {
    if (!req.session.user){
        return res.send({isLogined:false});
    }
    return res.send({isLogined:true});
});

module.exports = router;
