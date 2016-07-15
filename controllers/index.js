'use strict';


var indexModel = require('../models/index');


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

    router.post('/find', function(req, res) {
        model.getByPokemonName(req.body.pokemon_name, function(err, response) {
            var parsedResponse = JSON.parse(response);

            if (parsedResponse && parsedResponse.data && parsedResponse.data.length > 0) {
                var a = parsedResponse.data.map(function(item) {
                    return {
                        pokemon_name: item.pokemon_name,
                        pokemon_location: item.pokemon_location,
                        id: item._id
                    }
                });
                var returnedObj = {
                    response: a,
                    status: 'OK'
                };
                var stringified = JSON.stringify(returnedObj);
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.write(stringified);
                res.end();
            }
        });
    });

    router.post('/submit', function(req, res) {

        model.submit(req.body, function(err, response) {

            res.write(response);
            res.end();

        });
    });

};