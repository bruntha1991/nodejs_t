var express = require('express');
var router = express.Router();
var path = require('path');


///* GET home page. */
//router.get('/home', function(req, res, next) {
//  res.render('home', { title: 'Ceylon Cuisine :Home' });
//});

router.get('/', function(req, res, next) {
  res.redirect('/home');
});

router.get('/home', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views') + '/index.html');
  //res.render('new', { title: 'Ceylon Cuisine :Home' });
});

router.get('/home-new', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views') + '/new.html');
  //res.render('new', { title: 'Ceylon Cuisine :Home' });
});

/* GET user management page. */
router.get('/user', function(req, res, next) {
  res.render('index', { title: 'Ceylon Cuisine :User Management' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Ceylon Cuisine : Login' });
});

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Ceylon Cuisine : Login' });
});

module.exports = router;
