var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryURL, function(error, data){
    if (error) console.warn(error);
    console.log(data.features);
    createMarkers(data.features);
})

function createMarkers(earthquakeData) {
        function onEachFeature(feature, layer) {
          layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        }
        var earthquakes = L.geoJSON(earthquakeData, {
          onEachFeature: onEachFeature,
          pointToLayer: function (feature, latlng) {
            var color;
            var mag;
            var radius;
            mag = feature.properties.mag;
            if (mag === null) {
              color = '#000';
              radius = 3;
            } else {
              color = d3.rgb(255/mag, 30/mag, 30/mag);
              radius = 3 * Math.max(mag, 1);
            }
            return L.circleMarker(latlng, {
              color: color,
              radius: radius
            });
          }
        });
        createMap(earthquakes);
      
};

function createMap(earthquakes){

    var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var street = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Light View": light,
        "Dark View": dark,
        "Street View": street,
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    }

    var myMap = L.map("map", {
        center: [39.5501, -105.7821],
        timeDimension: true,
        timeDimensionControl: true,
        zoom: 5,
        layers: [street, light, dark]
    });

    L.control.layers(baseMaps, overlayMaps,{
        collapsed: false
    }).addTo(myMap);

};

