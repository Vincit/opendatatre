if (Meteor.isClient) {
  // Map template is rendered only once because of the contant block.
  Template.map.rendered = function () {
    // Initialize the map
    var map = L.map('map').setView([61.5, 23.75], 13);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // Necessary for Leaflet's marker icons to work.
    L.Icon.Default.imagePath = '/images';

    // Load the data on server to avoid same-origin policy problems.
    Meteor.call('getSites', function(error, result) {
      console.log(result);
      if (result) {
        var setPopup = function(feature, layer) {
          var siteName = feature.properties.NIMI ||
                         feature.properties.ALUE_NIMI;
          if (siteName) {
            layer.bindPopup(siteName);
          }
        };

        for (var i=0; i < result.length; ++i) {
          var geoJsonOptions = {
            onEachFeature: setPopup,
            style: { color: 'red', opacity: 1.0 }
          };
          // Each result item is a GeoJSON FeatureCollection,
          // which can be given to Leaflet as is.
          L.geoJson(result[i], geoJsonOptions).addTo(map);
        }
      }
    });
  };
}

if (Meteor.isServer) {
  Meteor.methods({
    'getSites': function() {
      // Each URL represents a JSON datasource. More datasources can be found
      // from http://www.tampere.fi/tampereinfo/avoindata.html
      var urls = [
        'http://tampere.navici.com/tampere_wfs_geoserver/tampere_iris/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tampere_iris:WFS_TALVILIUKUPAIKKA&outputFormat=json',
        'http://tampere.navici.com/tampere_wfs_geoserver/tampere_iris/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tampere_iris:WFS_PYORATIET&outputFormat=json',
        'http://tampere.navici.com/tampere_wfs_geoserver/tampere_iris/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tampere_iris:WFS_KENTTA&outputFormat=json'
      ];

      var sites = [];
      for (var i=0; i < urls.length; ++i) {
        try {
          // Leaflet doesn't understand Geoserver's default coordinate system,
          // so we must request the data in EPSG:4326 projection,
          // which is what Leaflet uses by default.
          var result = HTTP.get(urls[i] + '&srsName=EPSG:4326',
            {timeout: 15000});

          if (result && result.content) {
            var parsedJSON = JSON.parse(result.content);
            if (parsedJSON) sites.push(parsedJSON);
          }
        } catch (error) {
          console.error(error);
        }
      }
      return sites;
    }
  });
}
