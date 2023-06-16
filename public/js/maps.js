//import dotenv from "dotenv";
//dotenv.config();
// AIzaSyBpeoFXNlfiHvBJ-BNYEih7Pl-sE5PEy6c
var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBpeoFXNlfiHvBJ-BNYEih7Pl-sE5PEy6c&callback=initMap';
script.async = true;



    window.initMap = function() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat:6.028254599999999, lng: -75.6947296 },
        
        zoom: 15,
        
      });
      var marker = new google.maps.Marker({
    position: { lat: 6.028254599999999, lng: -75.6947296 },
    map: map
  });
      
};




document.head.appendChild(script);