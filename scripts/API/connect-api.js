$(document).ready(function(){
  var invocation = new XMLHttpRequest();
  var url = 'http://ratings.food.gov.uk/search/cafe/newcastle/json';
//  var invocationHistoryText;

  invocation.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        myFunction(myArr);
    }
  };

  invocation.open("GET", url, true);
  invocation.withCredentials = true;
  invocation.send();

  function myFunction(arr) {
      var out = "";
      var i;
      for(i = 0; i < arr.length; i++) {
          out += '<a href="' + arr[i].url + '">' +
          arr[i].display + '</a><br>';
      }
      document.getElementById("id01").innerHTML = out;
  }





  function callOtherDomain(){
      if(invocation)
      {
          invocation.open('GET', url, true);
          Session.Request.Headers.Add("x-api-version", 2);
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
  }

})
