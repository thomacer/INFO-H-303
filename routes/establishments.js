var express = require('express');
var router = express.Router();

var helpers_fun = require('../js/handlebars_helpers.js');
var request = require('request');

var db = require('../db/database_utils.js');
var User = require('../db/user_db.js');
var Label = require('../db/labels_utils.js');
var Comments = require('../db/comment_utils.js');
var Bar = require('../db/bar_db_utils.js');
var Restaurant = require('../db/restaurant_db_utils.js');
var Hotel = require('../db/hotel_db_utils.js');

var async = require('async');

router.get('/', function (req, res) {
    async.parallel([
        function (callback) {
            db.pick("restaurant", function (err, result) {
                 db.pick_random_from(3, result, function (err, result) {
                    callback(null, result);
                 });
            });
        },

        function (callback) {
            db.pick("bar", function (err, result) {
                 db.pick_random_from(3, result, function (err, result) {
                    callback(null, result);
                 });
            });
        },

        // function (callback) {
        //     db.pick("hotel", function (err, result) {
        //          db.pick_random_from(3, result, function (err, result) {
        //              callback(null, result);
        //          });
        //     });
        //     setTimeout(function() {
        //         callback(null, []);
        //     }, 200);
        // }
    ], function (err, result) {
        res.render('establishments/showoff', {
            restaurants : result[0],
            bars : result[1],

            user : req.user,

            helpers : {
                thumbnailing : helpers_fun.thumbnailing
            },
        }) 
    });
});

router.post('/update/:id/address', function (req, res) {
    if (!req.user || !req.user.admin) {
        return res.redirect('/404');
    }

    async.parallel([
        function (callback) {
            db.update(req.params.id, 'address_street', req.body['address_street'], function (err) {
            });
        }, function (callback) {
            db.update(req.params.id, 'address_town', req.body['address_town'], function (err) {
            });
        }, function (callback) {
            db.update(req.params.id, 'address_number', req.body['address_number'], function (err) {
            });
        }, function (callback) {
            db.update(req.params.id, 'address_zip', req.body['address_zip'], function (err) {
            });
        }
    ]);
});

router.post('/update/:id/:type', function (req, res) {
    if (!req.user || !req.user.admin) {
        return res.redirect('/404');
    }

    db.update(req.params.id, req.params.type, req.body[req.params.type], function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect('back');
    });
});

/* @desc : Classement des établissements en fonction de leur moyenne.
 */
router.get('/rankings',  function (req, res) {
    db.rankings(function (err, results) {
        if (err) {
            console.log(err);
            return res.redirect('/404');
        }
        return res.render('establishments/showoff', {
            establishments : results,

            user : req.user,

            helpers : {
                thumbnailing : helpers_fun.thumbnailing
            }
        });
    });
});

/* @desc : Liste les restaurants peut connu sur le site.
 */
router.get('/discover',  function (req, res) {
    db.discover(function (err, results) {
        if (err) {
            console.log(err);
            return res.redirect('/404');
        }
        return res.render('establishments/showoff', {
            discovers : results,

            user : req.user,

            helpers : {
                thumbnailing : helpers_fun.thumbnailing
            }
        });
    });
});

router.get('/restaurants',  function (req, res) {
    db.pick("restaurant", function (err, result) {
        db.pick_random_from(6, result, function (err, result) {
            res.render('establishments/showoff', {
                restaurants : result,

                user : req.user,

                helpers : {
                    thumbnailing : helpers_fun.thumbnailing
                }
            });
        });
    });
});

router.get('/bars',  function (req, res) {
    db.pick("bar", function (err, result) {
        db.pick_random_from(6, result, function (err, result) {
            res.render('establishments/showoff', {
                bars : result,

                user : req.user,

                helpers : {
                    thumbnailing : helpers_fun.thumbnailing
                }
            });
        });
    });
});

router.get('/hotels',  function (req, res) {
    db.pick("hotel", function (err, result) {
        db.pick_random_from(3, result, function (result) {
            res.render('establishments/showoff', {
                hotels : result,

                user : req.user,

                helpers : {
                    thumbnailing : helpers_fun.thumbnailing
                }
            });
        });
    });
});

router.get('/image/:id', function (req, res) {
    var api = "http://searx.me/?category_images=on&format=json&q=";
    db.get_establishment_image(req.params.id, function (err, result) {
        if (result.picture) {
            res.send(result.picture);
        } else {
            request(api + result.name.replace(' ', '+') + "+" + result.address_town, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var json =  JSON.parse(body)
                    if (json['results'].length) {
                        return res.redirect(302, json['results'][0]['img_src']);
                    }
                }
                return res.redirect(302, "http://www.hospitalitymagazine.com.au/getmedia/4abeaf84-fa2b-43a1-8e3d-01ab31e8aaeb/My-Kitchen-Rules-chef-Pete-Evans-new-Melbourne-res.aspx");
            });
        }
    });
});

router.post('/bar/update/:id/:type', function (req, res) {
    if (!req.user || !req.user.admin) {
        return res.redirect('/404');
    }

    var value = req.body[req.params.type] == 'on' ? 1 : 0;
    Bar.update(req.params.id, req.params.type, value, function(err) {
        if (err) {
            console.log(err);
            return res.redirect('/404');
        }
        return res.redirect('back');
    });
});

router.get('/bar/:id',  function (req, res) {
    async.parallel([
        function(callback) { // Getting the "bar" establishment.
            db.get_bar(req.params.id, function (err, result) {
                setTimeout(function() {
                    callback(null, result);
                }, 200);
            });
        }, function(callback) { // Getting the comments.
            Comments.get_comments(req.params.id, function (err, results) {
                if (err) {
                    console.log("Error getting comments : " + err);
                }

                setTimeout(function() {
                    callback(null, results);
                }, 200);
            });
        }, function(callback) { // Getting the labels.
            Label.get_labels(req.params.id, function (err, results) {
                if (err) {
                    console.log("Error getting labels : " + err);
                }

                setTimeout(function() {
                    callback(null, results);
                }, 200);
            })
        }
    ], function (err, results) {
        res.render('establishments/establishment', {
            establishment : results[0],
            comments : results[1],
            labels : results[2],

            user : req.user,

            helpers : {
                icon : helpers_fun.icon,
                stars : helpers_fun.stars_maker,
                average : helpers_fun.average
            }
        });
    });

});

router.post('/hotel/update/:id/:type', function (req, res) {
    if (!req.user || !req.user.admin) {
        return res.redirect('/404');
    }

    var value = req.body[req.params.type];
    Hotel.update(req.params.id, req.params.type, value, function(err) {
        if (err) {
            console.log(err);
            return res.redirect('/404');
        }
        return res.redirect('back');
    });
});

router.get('/hotel/:id',  function (req, res) {
    async.parallel([
        function(callback) { // Getting the "bar" establishment.
            db.get_hotel(req.params.id, function (err, result) {
                setTimeout(function() {
                    callback(null, result);
                }, 200);
            });

        }, function(callback) { // Getting the comments.
            Comments.get_comments(req.params.id, function (err, results) {
                if (err) {
                    console.log("Error getting comments : " + err);
                }

                setTimeout(function() {
                    callback(null, results);
                }, 200);
            });
        }, function(callback) { // Getting the labels.
            Label.get_labels(req.params.id, function (err, result) {
                var ret = [];
                if (err) {
                    console.log("Error getting labels : " + err);
                } else {
                    ret = result;
                }

                setTimeout(function() {
                    callback(null, ret);
                }, 200);
            })
        }
    ], function (err, results) { 
        res.render('establishments/establishment', {
            establishment : results[0],
            comments : results[1],
            labels : results[2],

            user : req.user,

            helpers : {
                icon : helpers_fun.icon,
                stars : helpers_fun.stars_maker,
                average : helpers_fun.average
            }
        });
    });
});

router.get('/restaurant/update/:id/timetable/:timetable/:zone', function (req, res) {
    var table = req.params.timetable;
    if (table[req.params.zone] == "1") {
        table = req.params.timetable.slice(0, req.params.zone);
        table += "0";
        table += req.params.timetable.slice((req.params.zone + 1));
    } else {
        table = req.params.timetable.slice(0, req.params.zone);
        table += "1";
        table += req.params.timetable.slice((req.params.zone + 1));
    }

    Restaurant.update(req.params.id, 'timetable', table, function(err) {
        if (err) {
            console.log(err);
            return res.redirect('/404');
        }
        return res.redirect('back');
    });
});

router.post('/restaurant/update/:id/takeaway', function (req, res) {
    if (!req.user || !req.user.admin) {
        return res.redirect('/404');
    }

    var value = req.body[req.params.type] == 'on' ? 1 : 0;
    Restaurant.update(req.params.id, 'takeaway', value, function(err) {
        if (err) {
            console.log(err);
            return res.redirect('/404');
        }
        return res.redirect('back');
    });
});

router.post('/restaurant/update/:id/delivery', function (req, res) {
    if (!req.user || !req.user.admin) {
        return res.redirect('/404');
    }

    var value = req.body[req.params.type] == 'on' ? 1 : 0;
    Restaurant.update(req.params.id, 'delivery', value, function(err) {
        if (err) {
            console.log(err);
            return res.redirect('/404');
        }
        return res.redirect('back');
    });
});

router.post('/restaurant/update/:id/:type', function (req, res) {
    if (!req.user || !req.user.admin) {
        return res.redirect('/404');
    }

    var value = req.body[req.params.type];
    Restaurant.update(req.params.id, req.params.type, value, function(err) {
        if (err) {
            console.log(err);
            return res.redirect('/404');
        }
        return res.redirect('back');
    });
});

router.get('/restaurant/:id',  function (req, res) {
    async.parallel([
        function(callback) { // Getting the "bar" establishment.
            db.get_restaurant(req.params.id, function (err, result) {
                setTimeout(function() {
                    callback(null, result);
                }, 200);
            });

        }, function(callback) { // Getting the comments.
            Comments.get_comments(req.params.id, function (err, results) {
                if (err) {
                    console.log("Error getting comments : " + err);
                }

                setTimeout(function() {
                    callback(null, results);
                }, 200);
            });
        }, function(callback) { // Getting the labels.
            Label.get_labels(req.params.id, function (err, result) {
                var ret = [];
                if (err) {
                    console.log("Error getting labels : " + err);
                } else {
                    ret = result;
                }

                setTimeout(function() {
                    callback(null, ret);
                }, 200);
            })
        }
    ], function (err, results) {
        res.render('establishments/establishment', {
            establishment : results[0],
            comments : results[1],
            labels : results[2],

            user : req.user,

            helpers : {
                icon : helpers_fun.icon,
                stars : helpers_fun.stars_maker,
                average : helpers_fun.average,
                timetable : helpers_fun.timetable,
            }
        });
    });
});

router.get('/:id',  function (req, res) {
    db.get_establishment_type(req.params.id, function (type) {
        res.redirect(type + '/' + req.params.id);
    });
});

module.exports = router;
