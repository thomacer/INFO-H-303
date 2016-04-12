var db = require('../db/database_utils.js');
var bar = require('../db/bar_db_utils.js');
var hotel = require('../db/hotel_db_utils.js');
var restaurant = require('../db/restaurant_db_utils.js');

var min = function (one, two) {
    if (one < two) {
        return one; 
    } else {
        return two; 
    }
};

var makeRestaurantThumbnail = function (restaurant) {
    var result = "";

    result += "<div class=\"col-sm-3\">";
    result += "<div class=\"thumbnail\">";

    if (restaurant["image"]) {
        result += "<img src=\"" + restaurant["image"] + "\">";
    }
    result += "<div class=\"caption\">"
    result += "<h3>" + restaurant["name"] + "</h3>";

    // fourchette de prix
    //
    // places maximum
    //
    // emporter des plat ?
    //
    // livraison
    //
    // fermeture

    result += "</div>"; // Closing "caption".
    result += "</div>"; // Closing "thumbnail".
    result += "</div>"; // Closing "col-sm-3"
};

var makeHotelThumbnail = function (hotel) {
    var result = "";

    result += "<div class=\"col-sm-3\">";
    result += "<div class=\"thumbnail\">";

    if (hotel["image"]) {
        result += "<img src=\"" + hotel["image"] + "\">";
    }
    result += "<div class=\"caption\">"
    result += "<h3>" + hotel["name"] + "</h3>";

    // Nombre d'étoile.
    //
    // Nombre de chambre
    //
    // Prix pour une nuit en chambre double.

    result += "</div>"; // Closing "caption".
    result += "</div>"; // Closing "thumbnail".
    result += "</div>"; // Closing "col-sm-3"
};

var makeBarThumbnail = function (bar) {
    var result = "";

    result += "<div class=\"col-sm-3\">";
    result += "<div class=\"thumbnail\">";

    if (hotel["image"]) {
        result += "<img src=\"" + bar["image"] + "\">";
    }
    result += "<div class=\"caption\">"
    result += "<h3>" + bar["name"] + "</h3>";

    // fumeur ?
    //
    // petite restauration

    result += "</div>"; // Closing "caption".
    result += "</div>"; // Closing "thumbnail".
    result += "</div>"; // Closing "col-sm-3"
};

var makeCarousel = function (list, design) {
     var result = ""; 

    result += "<div class=\"item active\">";
    var i = 0;
    for (i = 0; i < min(list.length, 3); ++i) {
        result += design(list[i]);
    }
    result += "</div>";

    while (i < list.length) {
        result += "<div class=\"item\">"
        for (i = 0; i < 4; ++i) {
            result += design(list[i]);
        }
        result += "</div>";
    }

    return result;
};


var stars_maker = function (number) {
    var result = "";
    for (var i = 0; i < 5; ++i) {
        if (i < number) {
            result += " <span class=\"glyphicon glyphicon-star\"></span>";
        } else {
            result += " <span class=\"glyphicon glyphicon-star-empty\"></span>";
        }
    }
};

module.exports = {
    count_list : function (list) {
        return list.length;
    },

    thumbnailing : function (establishments) {
        var result = "";  

        var current = -1;

        result += "<div class=\"row\">";
        for (var i = 0; i < establishments.length; ++i) {
            if ( (i % 3) == 0) {
                result += "</div>";
                result += "<div class=\"row\">";
            }

            result += "<div class=\"col-sm-6 col-md-4\"><div class=\"thumbnail\">";
            result += "<img src=\"/image/" + establishments[i].id + "\">";
            result += "<div class=\"caption\">";

            result += "<h3>" + establishments[i].name + "</h3>";

            result += "<p><span class=\"glyphicon glyphicon-road\" aria-hidden=\"true\"></span>" + establishments[i].address_street + ", " + establishments[i].address_number + " (" + establishments[i].address_town + ")." + "</p>";
            result += "<p><span class=\"glyphicon glyphicon-earphone\" aria-hidden=\"true\"></span>" + establishments[i].phone_number + "</p>";
            if (establishments[i].website)
                result += "<p><span class=\"glyphicon glyphicon-cloud\" aria-hidden=\"true\"></span><a href=\"" + establishments[i].website + "\">" + establishments[i].website + "</a></p>";
            result += "<p><a href=\"/establishment/" + establishments[i].id + "\" class=\"btn btn-primary\" role=\"button\">Me montrer</a></p>";
            result += "</div>";
            result += "</div>";
            result += "</div>";
        }

        result += "</div>";

        return result;
    },
};
