// ORIGINAL SOURCE: http://openlayers.org/dev/examples/osm-marker-popup.js
// References:
//  http://diveintohtml5.info/geolocation.html

var map;
var lon = -79.917452;
var lat = 43.263626;

function updatePosition(pos) {
    console.log('in updatePosition()! got:', pos);

    //lat = pos.coords.latitude;
    //lon = pos.coords.longitude;
}

function geoError(err) {
    console.warn('posErr:', posErr);
}

function doUpdate() {
    console.log('in doUpdate()!');

    //navigator.geolocation.getCurrentPosition(
    geoPosition.getCurrentPosition(
        updatePosition,
        geoError
    );
}

function userInit() {
    if (geoPosition.init()) {
        doUpdate();
    } else {
        console.warn('no geolocation support');
    }
}

function init() {
    userInit();

    // The overlay layer for our marker, with a simple diamond as symbol
    var overlay = new OpenLayers.Layer.Vector('Overlay', {
        styleMap: new OpenLayers.StyleMap({
            externalGraphic: './media/marker.png',
            graphicWidth: 20, graphicHeight: 24, graphicYOffset: -24,
            title: '${tooltip}'
        })
    });

    // The location of our marker and popup. We usually think in geographic
    // coordinates ('EPSG:4326'), but the map is projected ('EPSG:3857').
    //var myLocation = new OpenLayers.Geometry.Point(10.2, 48.9)

    var myLocation = new OpenLayers.Geometry.Point(lon, lat)
        .transform('EPSG:4326', 'EPSG:3857');

    // We add the marker with a tooltip text to the overlay
    overlay.addFeatures([
        new OpenLayers.Feature.Vector(myLocation, {tooltip: 'Hackathon'})
    ]);

    // A popup with some information about our location
    var popup = new OpenLayers.Popup.FramedCloud("Popup", 
        myLocation.getBounds().getCenterLonLat(), null,
        '<a target="_blank" href="http://openhamilton.ca/">Open Hamilton</a><br/>' +
        'HSR Hackathon', null,
        true // <-- true if we want a close (X) button, false otherwise
    );

    // Finally we create the map
    map = new OpenLayers.Map({
        div: "demoMap", projection: "EPSG:3857",
        layers: [new OpenLayers.Layer.OSM(), overlay],
        center: myLocation.getBounds().getCenterLonLat(), zoom: 15
    });

    // and add the popup to it.
    map.addPopup(popup);
}

window.addEventListener('load', init);
