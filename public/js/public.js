var isSubmitShown = false;
var isFindPokemonShown = false;
var alertBox = document.querySelector('.alert');

document.querySelector('.submit-pokemon').addEventListener('click', toggleSubmit);
document.querySelector('.find-pokemon').addEventListener('click', toggleFind);
document.querySelector('.submit_pokemon').addEventListener('click', submitNewEntry);
document.querySelector('.find_pokemon').addEventListener('click', findPokemon);
document.querySelector('.find-me').addEventListener('click', findMe);

function findMe() {
    var inputField = document.querySelector('.my_location');
    moveToLocation(inputField.value);
}

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
    var mc = document.querySelector('input[name="my_city"]');

    marmottajax({
        url: '/find',
        method: 'POST',
        parameters: {
            'pokemon_name': fp.value.toLowerCase(),
            'my_city': mc.value.toLowerCase()
        }

    }).then(function(result) {
        var returned = JSON.parse(result);
        var arr = returned.response;
        if (returned.response.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                codeAddress(arr[i].pokemon_location, arr[i].pokemon_name);
            }
        }
    }).error(function(message) {
        alertBox.textContent = "sorry, an unknown error occurred";
        addClass(alertBox, 'show');
        addClass(alertBox, 'failure');
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

// START GOOGLE MAPS STUFF
var script = document.createElement('script');
script.src = "//maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
document.body.appendChild(script);

var geocoder;
var map;

function initialize() {
    geocoder = new google.maps.Geocoder();
    //var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap'
    };

    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    map.setTilt(45);

    // Multiple Markers
    var markers = [
        ['', 37.338208, -121.886329]
    ];

    // Info Window Content
    var infoWindowContent = [
        ['Rattata found here!']
    ];

    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(),
        marker, i;

    // Loop through our array of markers & place each one on the map  
    for (i = 0; i < markers.length; i++) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0]
        });

        // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });

    //codeAddress('5620 fayland drive erie pa 16509')
}

function moveToLocation(address) {
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.lat();
            var lng = results[0].geometry.location.lng();
            var center = new google.maps.LatLng(lat, lng);
            // using global variable:
            map.panTo(center);
        } else {
            alert('invalid address, please check again');
        }
    });
}

function codeAddress(address, title) {
    var addressList = document.querySelector('.address-list');
    addressList.innerHTML = '';
    // var address = document.getElementById("address").value;
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: title
            });
            for (var i = 0; i < results.length; i++) {
                var li = document.createElement('li');
                li.classList.add('address');
                li.textContent = results[i].formatted_address;
                addressList.appendChild(li);
            }
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}