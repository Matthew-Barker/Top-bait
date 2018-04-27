var marker, infoWindow, google;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(54.973845, -1.613166),
        mapTypeId: 'roadmap',
        fullscreenControl: false,
        streetViewControl: false
    });
    Geoloc();

    LoadJSON(function (data) {
        sortJSON(map, data)
    });
}

function LoadJSON(callback) {
    var items = [];
    $.getJSON("scripts/FHRS_json.json", function (data) {
        callback(data);
    });

}

function sortJSON (map, data) {

    var list = data.FHRSEstablishment.EstablishmentCollection.EstablishmentDetail;
    var latlng = [];

    for (var x = 0; x<25; x++){
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

            addMarkers(map, address, name, rating, latlng);
        }
    }
}

function addMarkers (map, address, name, rating, latlng) {
            
    marker = new google.map.Marker({
        map: map,
        position: latlng,
        animation: google.maps.Animation.DROP,
        icon: 'images/user-pin.png'
    });

    var infoWindow = new google.map.InfoWindow();
    marker.addListener('mouseover', function() {
        infoWindow.setContent(name + ' ' + address + ' ' + rating);
        infoWindow.open(map, this);
    });

    marker.addListener('mouseover', function() {
        infoWindow.setContent(" ");
        infoWindow.close();
    });
}

function Geoloc() {
    infoWindow = new google.maps.InfoWindow;
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            marker = new google.maps.Marker({
                position: new google.maps.LatLng(pos.lat, pos.lng),
                map: map,
                animation: google.maps.Animation.DROP,
                icon: 'images/user-pin.png'

            });

            /* click event to view event page for marker */
            google.maps.event.addListener(marker, "click", () => {
                infoWindow.setPosition(pos);
                infoWindow.setContent('Your location');
                infoWindow.open(map);
            });

          map.setCenter(pos);
          map.setZoom(13);
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

    //------------- Distance matrix-------------------\\

function distanceMatrix() {
    var markersArray = []
    var geocoder = new google.maps.Geocoder;
    var bounds = new google.maps.LatLngBounds;
    var service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
    {
        origins: [origin1],
        destinations: [destinationA],
        travelMode: 'WALKING',
        unitSystem: google.maps.UnitSystem.METRIC,
        provideRouteAlternatives: true,
        optimizeWaypoints: true
    }, function(response, status) {
    if (status !== 'OK') {
        alert('Error was: ' + status);
    } else {
        var originList = response.originAddresses;
        var destinationList = response.destinationAddresses;
        var outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '';
        deleteMarkers(markersArray);

        var showGeocodedAddressOnMap = function(asDestination) {
        var icon = asDestination ? destinationIcon : originIcon;
        return function(results, status) {
            if (status === 'OK') {
            map.fitBounds(bounds.extend(results[0].geometry.location));
            markersArray.push(new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                icon: icon
            }));
            } else {
            alert('Geocode was not successful due to: ' + status);
            }
        };
        };

        for (var i = 0; i < originList.length; i++) {
        var results = response.rows[i].elements;
            geocoder.geocode({'address': originList[i]},
            showGeocodedAddressOnMap(false));
            for (var j = 0; j < results.length; j++) {
                geocoder.geocode({'address': destinationList[j]},
                showGeocodedAddressOnMap(true));
                outputDiv.innerHTML += originList[i] + ' to ' + destinationList[j] +
                    ': ' + results[j].distance.text + ' in ' +
                    results[j].duration.text + '<br>';
            }
        }
        function deleteMarkers(markersArray) {
            for (var i = 0; i < markersArray.length; i++) {
                markersArray[i].setMap(null);
            }
            markersArray = [];
        }
        //add an eventlistener to the dom to call the initialize function when the window is loaded
    }
    });
}
