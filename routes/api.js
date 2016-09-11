/**
 * Created by bruntha on 6/5/16.
 */
var express = require('express');
var router = express.Router();

router.post('/getMainFood', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

router.get('/getSubFood/:mF', function (req, res) {
    var db = req.db;
    //var mainFood=req.body.mainFood;
    //console.log(req.body);
    var mainFood = (req.params.mF).replace("%20"," ");

    var collection = db.get('restaurant');
    collection.find({"mainFood.foodName":mainFood}, {}, function (e, docs) {
        res.json(docs);
    });
});

router.get('/getFoodList/:mF/:sF', function (req, res) {
    var db = req.db;
    //var mainFood=req.data.mainFood;
    //var subFood=req.data.subFood;
    var mainFood = (req.params.mF).replace("%20"," ");
    var subFood = (req.params.sF).replace("%20"," ");

    var collection = db.get('restaurant');
    collection.find({"mainFood.foodName":mainFood,"mainFood.subFood.foodName":subFood}, {}, function (e, docs) {
        res.json(docs);
    });
});

router.get('/getRestaurantList/:mF/:sF/:fL', function (req, res) {
    var db = req.db;
    //var mainFood=req.params.mainFood;
    //var subFood=req.params.subFood;
    //var listFood=req.params.listFood;
    var mainFood = (req.params.mF).replace("%20"," ");
    var subFood = (req.params.sF).replace("%20"," ");
    var listFood = (req.params.fL).replace("%20"," ");

    var collection = db.get('restaurant');
    collection.find({"foodList.mainFood":mainFood,"foodList.subFood":subFood,"foodList.foodName":listFood},{}, function (e, docs) {
        res.json(docs);
    });
});

router.get('/getRestaurant/:id', function (req, res) {
    var db = req.db;
    var restaurantID=req.params.id;
    var collection = db.get('restaurant');
    collection.find({_id:restaurantID},{}, function (e, docs) {
        res.json(docs);
    });
});

//router.post('/login/', function (req, res) {
//    var db = req.db;
//    var collection = db.get('userlist');
//    collection.find({_id:restaurantID},{}, function (e, docs) {
//        res.json(docs);
//    });
//});

router.post('/login', function (req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var msg;
    //var email=req.params.loginEmail;
    //var password=req.param('loginPassword');
    //Firebug + console.log(req)
    collection.find(req.body, function (e, docs) {
        if (docs.length != 0) {
            msg = '';
        } else {
            msg = 'Not Valid Credentials'
        }

        res.send((e === null) ? {msg: docs} : {msg: 'error: ' + msg});
    });
});

module.exports = router;
