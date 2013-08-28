if (Meteor.isClient) {
  Template.map.rendered = function () {
    var map = L.map('map').setView([61.5, 23.75], 13);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    L.Icon.Default.imagePath = '/images';

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
          L.geoJson(result[i], {
            onEachFeature: setPopup,
            style: { color: 'red', opacity: 1.0 }
          }).addTo(map);
        }
      }
    });
  };
}

if (Meteor.isServer) {
  Meteor.methods({
    'getSites': function() {
      var urls = [
        'http://tampere.navici.com/tampere_wfs_geoserver/tampere_iris/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tampere_iris:WFS_TALVILIUKUPAIKKA&outputFormat=json',
        'http://tampere.navici.com/tampere_wfs_geoserver/tampere_iris/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tampere_iris:WFS_PYORATIET&outputFormat=json',
        'http://tampere.navici.com/tampere_wfs_geoserver/tampere_iris/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tampere_iris:WFS_KENTTA&outputFormat=json'
      ];

      var sites = [];
      for (var i=0; i < urls.length; ++i) {
        try {
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
