function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(54.973845, -1.613166),
        mapTypeId: 'roadmap',
        fullscreenControl: false,
        streetViewControl: false
    });

    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(54.973845, -1.613166),
        animation: google.maps.Animation.DROP
    });
}