var mapObj, pos, clickAddress, clickLatlng, directionsService, directionsDisplay;
var markerList = [];
var rstMarker = [];

function initMap() {

    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
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
        geoLoc(geocoder);
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
                removeMarkers(markerList);
                clickAddress = results[0].formatted_address;
                document.getElementById("click-address").innerHTML = '<p>'+ clickAddress +'</p>';

                var marker = new google.maps.Marker({
                    position: clickLatlng,
                    map: mapObj,
                    animation: google.maps.Animation.DROP,
                    icon: 'images/user-pin.png'
                });
                markerList.push(marker);
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
    var oneCounter = twoCounter = threeCounter = fourCounter = fiveCounter = 0;

    for (var x = 0; x<2000; x++){
        if ((list[x].RatingValue == 1) && (oneCounter < 6)) {
            oneCounter++;
            storeJSON(list[x]);

        } else if ((list[x].RatingValue == 2) && (twoCounter < 5)) {
            twoCounter++;
            storeJSON(list[x]);

        } else if ((list[x].RatingValue == 3) && (threeCounter < 5)) {
            threeCounter++;
            storeJSON(list[x]);

        } else if ((list[x].RatingValue == 4) && (fourCounter < 5)) {
            fourCounter++;
            storeJSON(list[x]);

        } else if ((list[x].RatingValue == 5) && (fiveCounter < 6)) {
            fiveCounter++;
            storeJSON(list[x]);
        }
    }
}

function storeJSON (data) {

    if (data.PostCode == rstMarker.PostCode) {
        return 
    } else {
        var tempHygiene, tempAdd, tempAdd2, tempName, tempPost;
        if (data.Scores) {
            if (data.Scores.Hygiene !== '') {
                tempHygiene = data.Scores.Hygiene;
            }
        } else {
            tempHygiene = 'N/A';
        }

        if (data.BusinessName !== '') {
            tempName = data.BusinessName;
        } else {
            tempName = 'N/A';
        }

        if (data.AddressLine1 !== '') {
            tempAdd = data.AddressLine1;
        } else {
            tempAdd = 'N/A';
        }

        if (data.addressLine2 !== '') {
            tempAdd2 = data.addressLine2;
        } else {
            tempAdd2 = '';
        }

        if (data.PostCode !== '') {
            tempPost = data.PostCode;
        } else {
            tempPost = 'N/A';
        }

        if (data.Geocode !== "") {

            var arrData = {
                name : data.BusinessName,
                addressLine1 : data.AddressLine1,
                addressLine2 : data.AddressLine2,
                postcode : data.PostCode,
                rating : data.RatingValue,
                hygiene : tempHygiene,
                latlng : data.Geocode
            }
        } else {
            var arrData = {
                name : data.BusinessName,
                addressLine1 : data.AddressLine1,
                addressLine2 : data.AddressLine2,
                postcode : data.PostCode,
                rating : data.RatingValue,
                hygiene : tempHygiene
            }
        }
        addMarkers(arrData, directionsService, directionsDisplay);
    }
}

function addMarkers (place, directionsService, directionsDisplay) {
    
    var geocoder = new google.maps.Geocoder();
    var location;
    var address = place.addressLine1 + ' ' + place.addressLine2 + ' ' + place.postcode;

    if ((place.latlng)) {
        var lat = place.latlng.Latitude;
        var lng = place.latlng.Longitude;
        location = new google.maps.LatLng(lat, lng);
    } else {
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK') {
                location = results;
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    var marker = new google.maps.Marker({
        map: mapObj,
        position: location,
        animation: google.maps.Animation.DROP,
        postcode: place.PostCode 
    });
    rstMarker.push(marker);
    var infoWindow = new google.maps.InfoWindow();
    marker.addListener('mouseover', function() {
        infoWindow.setContent("<div id='twitter'></div>");
        infoWindow.open(mapObj, this);
        searchTweets(place.name);
    })

    infoWindow.addListener('mouseout', function() {
        //infoWindow.setContent("");
        infoWindow.close(mapObj, this);
    })

    marker.addListener('click', function() {

        var summaryPanel = document.getElementById('routeInfo');
        userOrigin = document.getElementById("click-address").innerHTML;
        summaryPanel.innerHTML = '';
        summaryPanel.innerHTML += '<b>' + place.name + '</b><br/>';
        summaryPanel.innerHTML += '<p>' + address + '</p>';
        summaryPanel.innerHTML += '<p>Overall rating: <b>' + place.rating + '/5 </b> Hygiene rating: <b>' + place.hygiene + '/15</b></p>';

        if (userOrigin !== '') {
            getRoute(place, location, userOrigin, directionsService, directionsDisplay);
        } 
    })

}

function searchTweets(name){
    //use ajax to posts the premises name to Twitter	
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //get the response from test.php and append it to the results div element
            $("#twitter").append(this.responseText);
        }
    };
    //build the query string from the passed name variable
    xmlhttp.open("GET", " twitter-search-functions.php?q=" + name, true);
    //send the request which will handle the Twitter search functionality
    xmlhttp.send();
  
}

function removeMarkers(marker){
    for(i=0; i<marker.length; i++){
        marker[i].setMap(null);
    }
}

function geoLoc(geocoder) {
    
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

        geocoder.geocode({
            'location': pos
          }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    document.getElementById("click-address").innerHTML = '<p>'+ results[0].formatted_address +'</p>';
              }
            }
          });

        // /* click event to view event page for marker */
        // google.maps.event.addListener(marker, "click", () => {
        //     infoWindow.setPosition(pos);
        //     infoWindow.setContent('Your location');
        //     infoWindow.open(mapObj);
        // });

        mapObj.setCenter(pos);
        mapObj.setZoom(13);
    }, function() {
        console.log('Geolocation is not supported');
    });
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
                removeMarkers(markerList);
                mapObj.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: mapObj,
                    animation: google.maps.Animation.DROP,
                    icon: 'images/user-pin.png'
                });
                markerList.push(marker);
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

function getRoute(place, latlng, userOrigin, directionsService, directionsDisplay) {
    //------------- Distance matrix-------------------\\
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
            summaryPanel.innerHTML += '<b>Address of - ' + place.name + '</b><br/>';
            summaryPanel.innerHTML += '<p>From: ' + route.legs[o].start_address + '</p>';
            summaryPanel.innerHTML += '<p>To: ' + route.legs[o].end_address + '</p>';
            summaryPanel.innerHTML += '<p>Distance from location: <b>' + route.legs[o].distance.text + '</b></p>';
            summaryPanel.innerHTML += '<p>Overall rating: <b>' + place.rating + '/5 </b> Hygiene rating: <b>' + place.hygiene + '/15</b></p>';
            }
        } else {
            alert('Error was: ' + status + ' Make sure you have set your location');
        }
    });
}
