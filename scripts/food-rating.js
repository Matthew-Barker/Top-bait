
$(document).ready(function(){

    function LoadJSON(callback) {
        $.getJSON("scripts/FHRS_json.json", function(result){
            $.each(result.EstablishmentCollection, function(obj){
                $.each(obj.EstablishmentDetail, function(data){
                    callback(data);
                });
            });
        })
    }

    function addData (map, data) {
        for (var x = 0; x<10; x++){
            if (data[x].RatingValue == 1) {
                var name = data[x].BusinessName;
                var addressLine1 = data[x].AddressLine1;
                var addressLine2 = data[x].AddressLine2;
                var postcode = data[x].PostCode;
                var rating = data[x].RatingValue;
        
                if (data[x].Geocode) {
                    $.each(data[x].Geocode, function(data){
                        var latlng = {
                            lat: data[x].PostCode,
                            lng: data[x].RatingValue
                        }
                    });
                }

                var address = addressLine1 + ' ' + addressLine2 + ' ' + postcode;

                addMarkers(map, address, name, rating, latlng);
            }
        }
    }

})