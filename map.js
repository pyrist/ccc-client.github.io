var map;


function init() {
    map = new OpenLayers.Map("basicMap");
    var mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);
    map.setCenter(new OpenLayers.LonLat(9.094, 48.824) // Center of the map
        .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
        ), 16 // Zoom level
    );
}


function reverse(x, y) {
    return new OpenLayers.LonLat(x, y) // Center of the map
        .transform(
            new OpenLayers.Projection("EPSG:900913"), // transform from WGS 1984
            new OpenLayers.Projection("EPSG:4326")
        )
}


function Collect() {
    o = map.getCenter();
    r = reverse(o.lon, o.lat);
    msg = { longitude: r.lon, latitude: r.lat }
    msg = JSON.stringify(msg);
    publishMessage(msg);
    SetLoadingIcon(false);
}


function log() {
    var line = Array.prototype.slice.call(arguments).map(function (argument) {
        return typeof argument === 'string' ? argument : JSON.stringify(argument);
    }).join(' ');
    obj = document.querySelector('#log')
    obj.textContent += line + "\n";
    document.querySelector('#output').scrollTop = document.querySelector('#output').scrollHeight;
}