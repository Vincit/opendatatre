Open Data TRE workshop
=======================

Workshopissa tehtävän sovelluksen tavoitetila
-----------

1. Selainsovellus pyytää palvelimelta sijaintitiedot
2. Palvelin hakee sijaintidatan esim. Open Data TRE:n rajapinnalta
3. Sijaintidata muokataan tarvittaessa haluttuun muotoon
4. Sijaintidata tarjoillaan selainsovellukselle palvelimelta
5. Selainsovellus syöttää datan Leafletille GeoJSON muodossa
6. Sijaintidata näkyy kartalla

Taskit
-----------

1. Tee Meteor-tapahtumankäsittelijä, jota kutsutaan kun map-template on luotu käyttöliittymään
  - Katso: http://docs.meteor.com/#template_rendered
2. Alusta kartta täydelle ruudulle
  - Katso: http://leafletjs.com/examples/quick-start.html
  - Anna tile layerille URL: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  - Anna Leafletille kuvien polku: ```L.Icon.Default.imagePath = '/images';```
3. Tee palvelimelle koodi, joka hakee Open Data TRE:n palvelusta talviliukupaikat
  - Talviliukupaikkojen JSON URL: http://tampere.navici.com/tampere_wfs_geoserver/tampere_iris/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tampere_iris:WFS_TALVILIUKUPAIKKA&outputFormat=json
  - Voit käyttää Meteor packagea HTTP, joka on jo lisätty projektiin
  - Katso: http://docs.meteor.com/#http_get
  - HUOM! Jotta Leaflet ymmärtää GeoServerin tuottaman sijaintidatan, tulee URL:n perään lisätä tämä merkkijono: ```'&srsName=EPSG:4326'```
4. Tee palvelimelle RPC-metodi käyttäen Meteor.methods-funktiota, joka palauttaa selaimelle sijaintidatan
  - Katso: http://docs.meteor.com/#meteor_methods
5. Tee client-päähän RPC-metodikutsu käyttäen Meteor.call-funktiota, joka hakee sijaintidatan palvelimelta
  - Katso: http://docs.meteor.com/#meteor_call
6. Lisää sijaintidata kartalle
  - Katso: http://leafletjs.com/reference.html#geojson
