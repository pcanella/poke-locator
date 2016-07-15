'use strict';

var Stamplay = require('stamplay');
var stamplay = new Stamplay('poke-locator', '5869c26d0de08e5903ecc554121879e1f5fffc1a18468c2cbbe4d2a73d837690');
var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();

module.exports = function IndexModel() {
    return {
        name: 'index',
        getByPokemonName: function(name, cb) {
            this.validatePokemon(name, function() {
                // if the pokemon is valid...
                var data = {
                    'pokemon_name': name
                }
                stamplay.Object('pokemon_location').get(data, function(err, response) {
                    cb(err, response);
                });
            })
        },
        submit: function(data, cb) {
            this.validatePokemon(data.pokemon_name, function(err, response) {

                if (!err) {
                    stamplay.Object('pokemon_location').save(data, function(error, result) {
                        var isError = (error !== null) ? true : false;
                        var message = (isError) ? 'An error occurred, please try again' : 'Your info was successfully added. Thanks for helping other trainers!'
                        cb(isError, message);
                    });
                } else {
                    cb(true, 'An error occurred, please try again');
                }
            });
        },

        validatePokemon: function(name, cb) {
            debugger;
            var t = P.getPokemonByName(name);

            if (t.then)
                t.then(function(response) {
                    cb(false, response);
                })
                .catch(function(error) {
                    console.log('There was an ERROR: ', error);
                    var message = 'Your Pokemon name is not valid. Please try again.';
                    error = true;
                    cb(true, message);
                });
        },

        find: function() {}
    };
};