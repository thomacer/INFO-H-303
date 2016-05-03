var express = require('express');
var router = express.Router();
var formidable = require('formidable');                                                                                                                                        
var fs = require('fs');

var db = require('../db/database_utils.js');
var Restaurant = require('../db/restaurant_db_utils.js');
var Bar = require('../db/bar_db_utils.js');
var Hotel = require('../db/hotel_db_utils.js');

router.get('/add', function (req, res) {
    if ((!req.user) || (!req.user.admin)) {
        return res.redirect(303, '404');
    
    }

    res.render('admin', {
        user : req.user,
    });
});

router.post('/add/restaurant', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, file) {
        if (err) {
            console.log("Error in form : " + err);
            return res.redirect(303, '/error');
        }

        fields.takeaway = ((fields.takeaway == "on") ? 1 : 0);
        fields.delivery = ((fields.delivery == "on") ? 1 : 0);

        Restaurant.new_restaurant(fields, function (id) {
            res.redirect('back');
        });
    });
});

router.post('/add/bar', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, file) {
        if (err) {
            console.log("Error in form : " + err);
            return res.redirect(303, '/error');
        }

        fields.smokers = ((fields.smokers == "on") ? 1 : 0);
        fields.snacks = ((fields.snacks == "on") ? 1 : 0);

        Bar.new_bar(fields, function (id) {
            res.redirect('back');
        });
    });
});

router.post('/add/hotel', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, file) {
        if (err) {
            console.log("Error in form : " + err);
            return res.redirect(303, '/error');
        }

        Hotel.new_hotel(fields, function (id) {
            res.redirect('back');
        });

    });
});

router.post('/file-upload',  function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, file) {
        if (err) {
            return res.redirect(303, '/error'); 
        }

        fs.readFile(file.file.path, function (err, data) {
            db.insert_picture(req.query.id, data, function (err) {
                if (err) {
                    console.log("Error uploading the picture : " + err);
                }
                res.redirect('back');
            });
        });
    });
});

module.exports = router;
