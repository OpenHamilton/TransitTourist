// ORIGINAL SOURCE: http://openlayers.org/dev/examples/osm-marker-popup.js

// References:
//  http://trac.osgeo.org/openlayers/wiki/Documentation
//  http://diveintohtml5.info/geolocation.html


// -- globals
var map,
    lon = -79.917452,
    lat = 43.263626
;


// -- setup our location tracking
function updatePosition(pos) {
    var overlay,
        feature,
        newLocation
    ;

    lat = pos.coords.latitude;
    lon = pos.coords.longitude;

    console.log('set position: %s, %s', lat, lon);

    if (map) {
        overlay = map.getLayersByName('poiOverlay')[0];

        if (overlay) {
            feature = overlay.getFeaturesByAttribute('id', 'user')[0];

            if (feature) {
                // not quite right, but not nearly as far off as with the transform below...
                newLocation = new OpenLayers.Geometry.Point(lon, lat);

                // marker ends up in Antarctica... we don't need to re-apply the transform?
                //newLocation = new OpenLayers.Geometry.Point(lon, lat).transform('EPSG:4326', 'EPSG:3857');

                feature.move(newLocation);

                return;
            }
        }
    }

    // emit debug msg if !(feature||overlay||map)
    console.log(map, overlay, feature);
}

function geoError(err) {
    console.warn('posErr:', posErr);
}

function doUpdate() {
    geoPosition.getCurrentPosition(updatePosition, geoError);
}

function userInit() {
    if (geoPosition.init()) {
        doUpdate();

    } else {
        console.warn('no geolocation support');
    }
}


// -- setup our OSM map
function init() {
    userInit();

    var myLocation,
        overlay,
        popup
    ;

    overlay = new OpenLayers.Layer.Vector('poiOverlay', {
        styleMap: new OpenLayers.StyleMap({
            externalGraphic: './media/marker.png',
            graphicWidth: 20, graphicHeight: 24, graphicYOffset: -24,
            title: '${tooltip}'
        })
    });

    // The location of our marker and popup. We usually think in geographic
    // coordinates ('EPSG:4326'), but the map is projected ('EPSG:3857').

    myLocation = new OpenLayers.Geometry.Point(lon, lat).transform('EPSG:4326', 'EPSG:3857');

    overlay.addFeatures([
        new OpenLayers.Feature.Vector(myLocation, {id: 'user', tooltip: 'Hackathon'})
    ]);

    popup = new OpenLayers.Popup.FramedCloud("Popup", 
        myLocation.getBounds().getCenterLonLat(), null,
        '<a target="_blank" href="http://openhamilton.ca/">Open Hamilton</a><br/>' +
        'HSR Hackathon', null,
        true // <-- true if we want a close (X) button, false otherwise
    );

    map = new OpenLayers.Map({
        div: "baseMap",
        projection: "EPSG:3857",
        layers: [new OpenLayers.Layer.OSM(), overlay],
        center: myLocation.getBounds().getCenterLonLat(), zoom: 15
    });

    map.addPopup(popup);
}

window.addEventListener('load', init);
