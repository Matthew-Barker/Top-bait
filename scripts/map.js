function initMap() {

map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: new google.maps.LatLng(54.97, 1.61),
    mapTypeId: 'roadmap'
});
var geocoder = new google.maps.Geocoder;

var contentString = '<div id="content">'+
  '<div id="siteNotice">'+
  '</div>'+
  '<h1 id="firstHeading" class="firstHeading">Newcastle</h1>'+
  '<div id="bodyContent">'+
  '<p><b>Band name</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
  'sandstone rock formation in the southern part of the '+
  'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
  'south west of the nearest large town, Alice Springs; 450&#160;km '+
  '(280&#160;mi) by road.</p>'+
  '<p>Phone number: 09877562988</p>'+
  '</div>'+
  '</div>';

var infowindow = new google.maps.InfoWindow({
    content: contentString
});

var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
var icons = {
    music: {
        icon: iconBase + 'parking_lot_maps.png'
    },
    parking: {
        icon: iconBase + 'parking_lot_maps.png'
    }
};
var features = [
    {
        position: new google.maps.LatLng(54.97, 1.61),
        type: 'music'
    }, {
        position: new google.maps.LatLng(54.97, 1.61),
        type: 'music'
    }
];

// Create markers.
    /*features.forEach(function(feature) {
        var marker = new google.maps.Marker({
            position: feature.position,
            icon: icons[feature.type].icon,
            map: map,
            title: 'Band names'
        });
    });*/

var marker = new google.maps.Marker({
    position: new google.maps.LatLng(54.97, 0.61),
    map: map,
    icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
    title: 'Uluru (Ayers Rock)'
});
marker.addListener('click', function() {
    infowindow.open(map, marker);
});

//------------- Distance matrix-------------------\\
var bounds = new google.maps.LatLngBounds;
var markersArray = []

//var origin1 = new google.maps.LatLng(55.930385, -3.118425);
var origin1 = 'Newcastle Upon Tyne, England';
var destinationA = 'Gateshead, England';
//var destinationB = new google.maps.LatLng(50.087692, 14.421150);

var destinationIcon = 'https://chart.googleapis.com/chart?' +
    'chst=d_map_pin_letter&chld=D|FF0000|000000';
var originIcon = 'https://chart.googleapis.com/chart?' +
    'chst=d_map_pin_letter&chld=O|FFFF00|000000';
var geocoder = new google.maps.Geocoder;

var service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
  {
    origins: [origin1],
    destinations: [destinationA],
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
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
  }
  });
}

function deleteMarkers(markersArray) {
    for (var i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
    }
    markersArray = [];
}
//add an eventlistener to the dom to call the initialize function when the window is loaded
