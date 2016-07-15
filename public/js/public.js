var isSubmitShown = false;
var isFindPokemonShown = false;
var alertBox = document.querySelector('.alert');

document.querySelector('.submit-pokemon').addEventListener('click', toggleSubmit);
document.querySelector('.find-pokemon').addEventListener('click', toggleFind);
document.querySelector('.submit_pokemon').addEventListener('click', submitNewEntry);
document.querySelector('.find_pokemon').addEventListener('click', findPokemon);

function toggleSubmit(e) {
    e.preventDefault();
    var ps = document.querySelector('.poke-submit');
    if (isSubmitShown === false) {
        addClass(ps, 'show');
        isSubmitShown = true;
    } else {
        isSubmitShown = false;
        removeClass(ps, 'show');
    }
}

function toggleFind(e) {
    e.preventDefault();
    var pf = document.querySelector('.poke-find');
    if (isFindPokemonShown === false) {
        addClass(pf, 'show');
        isFindPokemonShown = true;
    } else {
        isFindPokemonShown = false;
        removeClass(pf, 'show');
    }
}

function submitNewEntry() {
    var pl = document.querySelector('input[name="pokemon_location_submit"]');
    var pn = document.querySelector('input[name="pokemon_name_submit"]');
    marmottajax({
        url: '/submit',
        method: 'POST',
        parameters: {
            'pokemon_location': pl.value,
            'pokemon_name': pn.value.toLowerCase()
        }

    }).then(function(result) {
        alertBox.textContent = result;
        addClass(alertBox, 'show');
        addClass(alertBox, 'success');
    }).error(function(message) {
        alertBox.textContent = message;
        addClass(alertBox, 'show');
        addClass(alertBox, 'failure');
    });
}

function findPokemon() {
    var fp = document.querySelector('input[name="find_pokemon"]');
    marmottajax({
        url: '/find',
        method: 'GET',
        parameters: {
            'pokemon_name': fp.value.toLowerCase()
        }

    }).then(function(result) {
        console.log(result);
        var returned = JSON.parse(result.response);
        // alertBox.textContent = result;
        // addClass(alertBox, 'show');
        // addClass(alertBox, 'success');
    }).error(function(message) {
        // alertBox.textContent = message;
        // addClass(alertBox, 'show');
        // addClass(alertBox, 'failure');
    });
}

function addClass(el, className) {
    if (el.classList)
        el.classList.add(className);
    else
        el.className += ' ' + className;
}

function removeClass(el, className) {
    if (el.classList)
        el.classList.remove(className);
    else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}