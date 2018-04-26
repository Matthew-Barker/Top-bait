// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}

// Make the actual CORS request.
function makeCorsRequest() {
  // This is a sample server that supports CORS.
  var url = 'http://ratings.food.gov.uk/search/cafe/newcastle/json';

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var title = getTitle(text);
    alert('Response from CORS request to ' + url + ': ' + title);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}

$(document).ready(function(){
/*  var invocation = new XMLHttpRequest();
  var url = 'http://ratings.food.gov.uk/search/cafe/newcastle/json';
  var invocationHistoryText;

  function callOtherDomain(){
      if(invocation)
      {
          invocation.open('GET', url, true);
          invocation.onreadystatechange = handler;
          invocation.send();
      }
      else
      {
          invocationHistoryText = "No Invocation TookPlace At All";
          var textNode = document.createTextNode(invocationHistoryText);
          var textDiv = document.getElementById("textDiv");
          textDiv.appendChild(textNode);
      }

  }
  function handler(evtXHR)
  {
      if (invocation.readyState == 4)
      {
              if (invocation.status == 200)
              {
                  var response = invocation.EstablishmentCollection.EstablishmentDetail;
                  $.each(response, function(obj){
                    alert(obj);
                    $.each(obj.row, function(key, value){
                      alert(key +" "+ value);
                    });
                  });


              }
              else
                  alert("Invocation Errors Occured");
      }
      else
          dump("currently the application is at" + invocation.readyState);
  }  http://ratings.food.gov.uk/search/cafe/newcastle/json
    scripts/FHRS_json.json
    */
$.getJSON("http://ratings.food.gov.uk/search/cafe/newcastle/json", function(result){
  var obj = JSON.parse(result);
  $.each(obj.EstablishmentCollection.EstablishmentDetail, function(key){
    alert(key);
    $.each(obj.EstablishmentCollection.EstablishmentDetail[key], function(attKey, attValue){
      var objEstab = obj.EstablishmentCollection.EstablishmentDetail[key];
      $.each(objEstab[attKey], function(childKey, childValue){
        var obj = objEstab[attkey][childKey];
        if (objEstab["Scores"]) {
          var innerObj = objEstab[attKey];
          $.each(innerObj[attKey], function(innerChildKey, innerChildValue){
            $("#list").append($("<li>").text(objEstab.Hygiene +" : "+ objEstab.Structural +" : "+ objEstab.ConfidenceInManagement));
          })
        } else if (objEstab["Geocode"]) {
          var innerObj = objEstab[attKey];
          $.each(innerObj[attKey], function(innerChildKey, innerChildValue){
            $("#list").append($("<li>").text(objEstab.Longitude +" : "+ objEstab.Latitude));
          })
        } else if (objEstab["Distance"]) {

        } else {
          $("#list").append($("<li>").text(obj.BusinessName +" : "+ obj.RatingValue));
        }
      });
    });
  });
})


})
