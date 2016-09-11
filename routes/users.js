var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function (req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

/*
 * POST to adduser.
 */
router.post('/adduser', function (req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.insert(req.body, function (err, result) {
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
        );
    });
});

/*
 *POST login
 */
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

        res.send((e === null) ? {msg: msg} : {msg: 'error: ' + msg});
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;
    collection.remove({'_id': userToDelete}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

/*
 * Update user.
 */
router.put('/update/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToEdit = req.params.id;
    collection.update({_id:userToEdit}, {$set:req.body}, function (err) {
        res.send((err === null) ? {msg: ''} : {msg: 'error: ' + err});
    });
});

module.exports = router;
