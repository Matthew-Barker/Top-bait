var mapObj, pos, clickAddress, clickLatlng;

function initMap() {

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var geocoder = new google.maps.Geocoder();

    mapObj = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(54.973845, -1.613166),
        mapTypeId: 'roadmap',
        fullscreenControl: false,
        streetViewControl: false
    });
    directionsDisplay.setMap(mapObj);

    if (navigator.geolocation) {
        geoLoc();
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, mapObj.getCenter());
    }

    google.maps.event.addListener(mapObj, 'click', function(event) {
        clickLatlng = event.latLng;
        geocoder.geocode({
          'latLng': event.latLng
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                clickAddress = results[0].formatted_address;
                document.getElementById("click-address").innerHTML = '<p>'+ clickAddress +'</p>';

                var marker = new google.maps.Marker({
                    position: clickLatlng,
                    map: mapObj,
                    animation: google.maps.Animation.DROP,
                    icon: 'images/user-pin.png'
                });
            }
          }
        });
    });

    LoadJSON(function (data) {
        sortJSON(mapObj, data, directionsService, directionsDisplay)
    });
}

function LoadJSON(callback) {
    $.getJSON("scripts/FHRS_json.json", function (data) {
        callback(data);
    });

}

function sortJSON (mapObj, data, directionsService, directionsDisplay) {

    var list = data.FHRSEstablishment.EstablishmentCollection.EstablishmentDetail;
    var latlng = [];

    for (var x = 0; x<60; x++){
        if (list[x].RatingValue == 1) {
            var name = list[x].BusinessName;
            var addressLine1 = list[x].AddressLine1;
            var addressLine2 = list[x].AddressLine2;
            var postcode = list[x].PostCode;
            var rating = list[x].RatingValue;
    
            if (list[x].Geocode) {
                $.each(list[x].Geocode, function(data){
                    latlng = new google.maps.LatLng(list[x].Latitude,
                    list[x].Longitude);
                });
            }
            var address = addressLine1 + ' ' + addressLine2 + ' ' + postcode;

            addMarkers(mapObj, address, name, rating, latlng, directionsService, directionsDisplay);
        } else if (list[x].RatingValue == 2) {
            var name = list[x].BusinessName;
            var addressLine1 = list[x].AddressLine1;
            var addressLine2 = list[x].AddressLine2;
            var postcode = list[x].PostCode;
            var rating = list[x].RatingValue;
    
            if (list[x].Geocode) {
                $.each(list[x].Geocode, function(data){
                    latlng = new google.maps.LatLng(list[x].Latitude,
                    list[x].Longitude);
                });
            }
            var address = addressLine1 + ' ' + addressLine2 + ' ' + postcode;

            addMarkers(mapObj, address, name, rating, latlng, directionsService, directionsDisplay);
        } else if (list[x].RatingValue == 3) {
            var name = list[x].BusinessName;
            var addressLine1 = list[x].AddressLine1;
            var addressLine2 = list[x].AddressLine2;
            var postcode = list[x].PostCode;
            var rating = list[x].RatingValue;
    
            if (list[x].Geocode) {
                $.each(list[x].Geocode, function(data){
                    latlng = new google.maps.LatLng(list[x].Latitude,
                    list[x].Longitude);
                });
            }
            var address = addressLine1 + ' ' + addressLine2 + ' ' + postcode;

            addMarkers(mapObj, address, name, rating, latlng, directionsService, directionsDisplay);
        } else if (list[x].RatingValue == 4) {
            var name = list[x].BusinessName;
            var addressLine1 = list[x].AddressLine1;
            var addressLine2 = list[x].AddressLine2;
            var postcode = list[x].PostCode;
            var rating = list[x].RatingValue;
    
            if (list[x].Geocode) {
                $.each(list[x].Geocode, function(data){
                    latlng = new google.maps.LatLng(list[x].Latitude,
                    list[x].Longitude);
                });
            }
            var address = addressLine1 + ' ' + addressLine2 + ' ' + postcode;

            addMarkers(mapObj, address, name, rating, latlng, directionsService, directionsDisplay);
        } else if (list[x].RatingValue == 5) {
            var name = list[x].BusinessName;
            var addressLine1 = list[x].AddressLine1;
            var addressLine2 = list[x].AddressLine2;
            var postcode = list[x].PostCode;
            var rating = list[x].RatingValue;
    
            if (list[x].Geocode) {
                latlng = new google.maps.LatLng(list[x].Geocode.Latitude,
                list[x].Geocode.Longitude);
            }
            var address = addressLine1 + ' ' + addressLine2 + ' ' + postcode;

            addMarkers(mapObj, address, name, rating, latlng, directionsService, directionsDisplay);
        }
    }
}

function addMarkers (mapObj, address, name, rating, latlng, directionsService, directionsDisplay) {
       
    var marker = new google.maps.Marker({
        map: mapObj,
        position: latlng,
        animation: google.maps.Animation.DROP,
    });

    var infoWindow = new google.maps.InfoWindow();
    marker.addListener('mouseover', function() {
        infoWindow.setContent(name + ' ' + address + ' ' + rating);
        infoWindow.open(mapObj, this);
    });

    marker.addListener('mouseout', function() {
        infoWindow.setContent(" ");
        infoWindow.close();
    });

    marker.addListener('click', function() {
        getRoute(latlng, directionsService, directionsDisplay, name);
    })

}

function geoLoc() {
    
    navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        var marker = new google.maps.Marker({
            position: pos,
            map: mapObj,
            animation: google.maps.Animation.DROP,
            icon: 'images/user-pin.png'
        });

        /* click event to view event page for marker */
        google.maps.event.addListener(marker, "click", () => {
            infoWindow.setPosition(pos);
            infoWindow.setContent('Your location');
            infoWindow.open(mapObj);
        });

        mapObj.setCenter(pos);
        mapObj.setZoom(13);
    }, function() {
        handleLocationError(true, infoWindow, mapObj.getCenter());
    });
}

function handleLocationError(browserHasGeolocation, infoWindow) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(mapObj);
}

function userInput() {
    var geocoder = new google.maps.Geocoder();
    address1 = $("#address1").val();
    address2 = $("#address2").val();
    postcode = $("#postcode").val();
    error = document.getElementById("address-error");
    error.innerHTML = "";

    if ((address1 !== "") && (address2 !== "") && (postcode !== "")) {
        clickAddress = address1 + ', ' + address2 + ' ' + postcode + ', UK';
        document.getElementById("click-address").innerHTML = '<p>'+ clickAddress +'</p>';

        geocoder.geocode({'address': clickAddress}, function(results, status) {
            if (status === 'OK') {
              mapObj.setCenter(results[0].geometry.location);
              var marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: mapObj,
                animation: google.maps.Animation.DROP,
                icon: 'images/user-pin.png'
              });
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    } else {
        //return error message
        error.innerHTML = "<p>Please enter an address into all the boxes</p>";
        return false;
    }
}

function getRoute(latlng, directionsService, directionsDisplay, name) {
    //------------- Distance matrix-------------------\\
    userOrigin = $("#click-address").innerHTML;
    directionsService.route(
        {
            origin: userOrigin,
            destination: latlng,
            travelMode: 'WALKING',
            unitSystem: google.maps.UnitSystem.METRIC,
            optimizeWaypoints: true
        }, function(response, status) {
        if (status === 'OK') {

            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            var summaryPanel = document.getElementById('routeInfo');
            summaryPanel.innerHTML = '';

            // For each route, display summary information.
            for (var o = 0; o < route.legs.length; o++) {
            summaryPanel.innerHTML += '<b>Address of - ' + name + '</b><br/>';
            summaryPanel.innerHTML += '<p>From: ' + route.legs[o].start_address + '</p>';
            summaryPanel.innerHTML += '<p>To: ' + route.legs[o].end_address + '</p>';
            summaryPanel.innerHTML += '<p>Distance from location: ' + route.legs[o].distance.text + '</p>';
            }
        } else {
            alert('Error was: ' + status);
        }
    });
}
