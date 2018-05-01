var mapObj, pos, clickAddress, clickLatlng, lastInfoWindow, geocoder, directionsService, directionsDisplay;
var markerList = [];
var rstMarker = [];
//Global varibles to be used across functions

function initMap() {

    //direction service to be used to set the route
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    var geocoder = new google.maps.Geocoder();

    //set up map with options
    mapObj = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(54.973845, -1.613166),
        mapTypeId: 'roadmap',
        fullscreenControl: false,
        streetViewControl: false
    });
    directionsDisplay.setMap(mapObj);

    //if browser supports geolocation
    if (navigator.geolocation) {
        //run geolocation function
        geoLoc(geocoder);
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, mapObj.getCenter());
    }

    //when user clicks on map - remove previous user location and add clicked location
    //then display location as address in panel
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
                    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                });
                markerList.push(marker);
            }
          }
        });
    });

    //Load data from JSON then sort into rating filters
    LoadJSON(function (data) {
        sortJSON(mapObj, data, directionsService, directionsDisplay)
    });
}

function LoadJSON(callback) {
    //get JSON from file
    $.getJSON("scripts/FHRS_json.json", function (data) {
        callback(data);
    });

}

function sortJSON (mapObj, data) {

    var icon;
    var list = data.FHRSEstablishment.EstablishmentCollection.EstablishmentDetail;
    var latlng = [];
    var oneCounter = twoCounter = threeCounter = fourCounter = fiveCounter = 0;
    
    //loop through data
    for (var x = 0; x<2000; x++){
        //if business type is related to food
        if ((list[x].BusinessType == "Restaurant/Cafe/Canteen") || (list[x].BusinessType == "Takeaway/sandwich shop")
        || (list[x].BusinessType == "Mobile caterer")) {
            // then split rate into different ratings and store into variables
            if ((list[x].RatingValue == 1) && (oneCounter < 6)) {
                oneCounter++;
                icon = 'images/rating-1.png';
                storeJSON(list[x], icon);
            } else if ((list[x].RatingValue == 2) && (twoCounter < 6)) {
                twoCounter++;
                icon = 'images/rating-2.png';
                storeJSON(list[x], icon);

            } else if ((list[x].RatingValue == 3) && (threeCounter < 6)) {
                threeCounter++;
                icon = 'images/rating-3.png';
                storeJSON(list[x], icon);
                
            } else if ((list[x].RatingValue == 4) && (fourCounter < 5)) {
                fourCounter++;
                icon = 'images/rating-4.png';
                storeJSON(list[x], icon);

            } else if ((list[x].RatingValue == 5) && (fiveCounter < 6)) {
                fiveCounter++;
                icon = 'images/rating-5.png';
                storeJSON(list[x], icon);
            }
        }
    }
}

function storeJSON (data, icon) {

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
        addMarkers(arrData, icon);
    }
}

function addMarkers (place, icon) {
    
    var geocoder = new google.maps.Geocoder();
    var location;
    //store resturant address into want
    var address = place.addressLine1 + ' ' + place.addressLine2 + ' ' + place.postcode;

    //if data has latitude and longitude stored in JSON then store in varible
    if ((place.latlng)) {
        var lat = place.latlng.Latitude;
        var lng = place.latlng.Longitude;
        location = new google.maps.LatLng(lat, lng);
    } else {
        //use geocode to turn address into lat and lng
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK') {
                location = results;
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    //create marker for passed data
    var marker = new google.maps.Marker({
        map: mapObj,
        position: location,
        animation: google.maps.Animation.DROP,
        postcode: place.PostCode,
        icon: icon
    });
    rstMarker.push(marker);
    var infoWindow = new google.maps.InfoWindow();
    
    //show twitter feed for resturant when mouseover - if infowindow already open then close previous one
    marker.addListener('mouseover', function() {
        if (lastInfoWindow){
            lastInfoWindow.close();
        }
        infoWindow.setContent("<div id='twitter'></div>");
        searchTweets(place.name);
        infoWindow.open(mapObj, this);
        lastInfoWindow = infoWindow;
    })

    //if marker clicked then get location and display in panel
    //if user location is set and marker clicked - disply route and information to marker
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
            //get the response from twitter-search-functions.php.php and append it to the results div element
            $("#twitter").append(this.responseText);
        }
    };
    //build the query string from the passed name variable
    xmlhttp.open("GET", " twitter-search-functions.php?q=" + name, true);
    //send the request which will handle the Twitter search functionality
    xmlhttp.send();
  
}

function removeMarkers(marker){
    //for every marker in passed array varible - clear off map
    for(i=0; i<marker.length; i++){
        marker[i].setMap(null);
    }
}

function geoLoc(geocoder) {
    
    //get user current posistion from browser
    navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        removeMarkers(markerList);

        //display marker on position
        var marker = new google.maps.Marker({
            position: pos,
            map: mapObj,
            animation: google.maps.Animation.DROP,
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        });
        markerList.push(marker);

        //display address of location using geocode on panel
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
    //get values from input boxes in the panel
    var geocoder = new google.maps.Geocoder();
    address1 = $("#address1").val();
    address2 = $("#address2").val();
    postcode = $("#postcode").val();
    error = document.getElementById("address-error");
    error.innerHTML = "";

    //if input boxes have data - store into one varible and display address in panel
    if ((address1 !== "") && (address2 !== "") && (postcode !== "")) {
        clickAddress = address1 + ', ' + address2 + ' ' + postcode + ', UK';
        document.getElementById("click-address").innerHTML = '<p>'+ clickAddress +'</p>';

        //geocode address to lat lng
        geocoder.geocode({'address': clickAddress}, function(results, status) {
            if (status === 'OK') {
                //if already user marker then remove from map
                removeMarkers(markerList);
                mapObj.setCenter(results[0].geometry.location);
                //create new user location marker
                var marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: mapObj,
                    animation: google.maps.Animation.DROP,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
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

function getRoute(place, latlng, userOrigin) {
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
            //display route on map
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            var summaryPanel = document.getElementById('routeInfo');
            summaryPanel.innerHTML = '';

            // For each route, display information into panel.
            for (var o = 0; o < route.legs.length; o++) {
                summaryPanel.innerHTML += '<b>Address of - ' + place.name + '</b><br/>';
                summaryPanel.innerHTML += '<p>From: ' + route.legs[o].start_address + '</p>';
                summaryPanel.innerHTML += '<p>To: ' + route.legs[o].end_address + '</p>';
                summaryPanel.innerHTML += '<p>Distance: <b>' + route.legs[o].distance.text + '</b> - Time: <b>' + route.legs[0].duration.text + '</b></p>';
                summaryPanel.innerHTML += '<p>Overall rating: <b>' + place.rating + '/5 </b> Hygiene rating: <b>' + place.hygiene + '/15</b></p>';
            }
        } else {
            alert('Error was: ' + status + ' Make sure you have set your location');
        }
    });
}
