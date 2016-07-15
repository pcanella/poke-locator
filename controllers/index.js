'use strict';


var HomeModel = require('../../models/index');


module.exports = function(router) {

    var model = new indexModel();

    router.get('/', function(req, res) {

        res.format({
            json: function() {
                res.json(model);
            },
            html: function() {
                res.render('index', model);
            }
        });
    });

    router.post('/submit', function(req, res) {

        model.submit(req.body, function() {


        })

        // res.format({
        //     json: function() {
        //         res.json(model);
        //     },
        //     html: function() {
        //         res.render('index', model);
        //     }
        // });
    });

};