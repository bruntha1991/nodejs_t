/**
 * Created by bruntha on 5/21/16.
 */
var express = require('express');
var router = express.Router();
var path = require('path');


/* GET restaurant page. */
router.get('/', function (req, res, next) {
    res.render('restaurant', {title: 'Ceylon Cuisine : Restaurant'});
});


/* GET mainFoodCategory page. */
//router.get('/main', function (req, res, next) {
//    //res.sendFile(path.join(__dirname, '../views') + '/restaurant/add_main_food.html');
//
//    res.render('restaurant/mainFoodCategory', {title: 'Ceylon Cuisine : Restaurant'});
//});

router.get('/main', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../views') + '/restaurant/mainFoodCategory.html');

});

/* GET restaurant home page. */
router.get('/home', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../views') + '/restaurant/restaurant.html');
    //res.render('restaurant/restaurant', {title: 'Ceylon Cuisine : Restaurant'});
});

/* GET restaurant subFoodCategory page. */
//router.get('/sub', function (req, res, next) {
//    res.render('restaurant/subFoodCategory', {title: 'Ceylon Cuisine : Restaurant'});
//});

/* GET restaurant subFoodCategory page. */
router.get('/sub', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../views') + '/restaurant/subFoodCategory.html');
});

/* GET restaurant page. */
//router.get('/list', function (req, res, next) {
//    res.render('restaurant/listFood', {title: 'Ceylon Cuisine : Restaurant'});
//});

/* GET restaurant page. */
router.get('/list', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../views') + '/restaurant/listFood.html');
});

/*
 * POST to add restaurant.
 */
router.post('/addRestaurant', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    collection.insert(req.body, function (err, result) {
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
        );
    });
});

/*
 * POST to add main food.
 */
router.post('/addMainFood', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    collection.insert(req.body, function (err, result) {
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
        );
    });
});

/*
 * POST to add sub food.
 */
router.post('/addSubFood', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    collection.insert(req.body, function (err, result) {
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
        );
    });
});

router.post('/addFoodList', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    collection.insert(req.body, function (err, result) {
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
        );
    });
});

/*
 * Get all restaurants
 */
router.get('/restaurant', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

/*
 * Update restaurants with main food
 */
router.put('/addMainFood/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    var userToEdit = req.params.id;
    collection.update({_id: userToEdit}, {$push: {mainFood: req.body}}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

/*
 * Update restaurants with sub food
 */
router.put('/addSubFood/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    var userToEdit = req.params.id;

    //collection.update({_id: userToEdit},{$push: {"mainFood.1.subFood":req.body}}, function (err) {
    collection.update({
        _id: userToEdit,
        "mainFood.foodName": req.body.mainFood
    }, {$push: {"mainFood.$.subFood": req.body}}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

router.put('/addFoodList/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    var userToEdit = req.params.id;

    //collection.update({_id: userToEdit},{$push: {"mainFood.1.subFood":req.body}}, function (err) {
    collection.update({
            _id: userToEdit,
            "mainFood.foodName": req.body.mainFood,
            "mainFood.subFood.foodName": req.body.subFood
        },
        {$push: {"foodList": req.body}}, {multi: true}, function (err) {
            res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
        });
});

router.get('/getMainFoodForSub/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    var restaurantID = req.params.id;

    collection.find({_id: restaurantID}, {}, function (e, docs) {
        res.json(docs);
    });
});

router.get('/getSubFoodForList/:id/:mF', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    var restaurantID = req.params.id;
    var mainFood = req.params.mF;
    console.log(mainFood);
    collection.find({_id: restaurantID, "mainFood.foodName": mainFood}, {}, function (e, docs) {
        res.json(docs);
    });
});

/*
 * Update restaurants with main food
 */
router.delete('/deleteMainFood/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    var userToEdit = req.params.id;
    collection.update({_id: userToEdit}, {$push: {mainFood: req.body}}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

/*
 * Update restaurants with sub food
 */
router.delete('/deleteSubFood/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    var userToEdit = req.params.id;

    //collection.update({_id: userToEdit},{$push: {"mainFood.1.subFood":req.body}}, function (err) {
    collection.update({
        _id: userToEdit,
        "mainFood.foodName": req.body.mainFood
    }, {$push: {"mainFood.$.subFood": req.body}}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

router.delete('/deleteFoodList/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    var userToEdit = req.params.id;

    //collection.update({_id: userToEdit},{$push: {"mainFood.1.subFood":req.body}}, function (err) {
    collection.update({
            _id: userToEdit,
            "mainFood.foodName": req.body.mainFood,
            "mainFood.subFood.foodName": req.body.subFood
        },
        {$push: {"foodList": req.body}}, {multi: true}, function (err) {
            res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});

        });
});

router.delete('/deleteRestaurant/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('restaurant');
    collection.insert(req.body, function (err, result) {
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
        );
    });
});

module.exports = router;
