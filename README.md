jQuery.MapMarker
================

Map widget to get lat and lng using Google Maps.

Installation
============
First load Google Maps API using your own API KEY, then just load jQuery and
jQuery.MapMarker.

    <script type="text/javascript" src="//maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
    <script src="jquery.min.js"></script>
    <script src="jquery.mapmarker.js"></script>

Usage
=====
Just specify `latField` and `lngField` properties, wich are the selectors of the input fields
where you want to store the lat and long values when the user select a location in the map.

    $('#map-canvas').mapMarker({
        'latField': '#latInputField',
        'lngField': '#lngInputField'
    });

Now, when the user select a location in the map, your input fields will be updated with the
lat and long values, is up to you store this values as you wish.
