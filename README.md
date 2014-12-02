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
        latField: '#latInputField',
        lngField: '#lngInputField'
    });

Now, when the user select a location in the map, your input fields will be updated with the
lat and long values, is up to you store this values as you wish.

Options
=======

lat {Number}
------------
Default latitude value when `latField` is not present or the field value is empty.

Default: 0

lng {Number}
------------
Default longitude value when `lngField` is not present or the field is empty.

Default: 0

latField {String}
-----------------
CSS selector of the field where to store/read latitude value.

Default: null

lngField {String}
-----------------
CSS selector of the field where to store/read longitude value.

Default: null

onChange {Function}
-------------------
This function is called when a new location in the map is selected or the marker is dragged to a new location.

*Arguments:*

 * location {google.maps.LatLng}


    onChange: function (location)
    {
        console.log('The new location is ' + location.lat() + ', ' + location.lng());
    }

onSearchStart {Function}
------------------------
This function is called when a search starts.

    onSearchStart: function ()
    {
        // Code to show a spinner or something...
    }

onSearchEnd {Function}
-------------------
This function is called when the search finish and after the results are printed in the view.

*Arguments:*

 * status {Number}


    onSearchEnd: function (status)
    {
        if (status == google.maps.GeocoderStatus.ZERO_RESULTS)
        {
            alert('No address found!');
        }
        
        // Do something with other status codes...
    }

mapOptions {Object}
-----------------
Options to pass directly to `goole.map.Map(...)`, see [Google Maps API Reference](https://developers.google.com/maps/documentation/javascript/reference?hl=es#MapOptions) for a complete list of options.

Default:

    {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 12
    }

markerOptions {Object}
-----------------
Options to pass directly to `goole.map.Marker(...)`, see [Google Maps API Reference](https://developers.google.com/maps/documentation/javascript/reference?hl=es#MarkerOptions) for a complete list of options.

Default:

    {
        draggable: true
    }

resultsView {String}
--------------------
CSS selector of the view (div) where to show the search results.

Default: null

resultTemplate {String}
--------------------
Template for each result, the string `:address` will be replaced with the result address.

Default: `'<a href="#">:address</a>'`

resultZoom {Number}
-----------------
Default zoom to apply when a search result is clicked.

Methods
=======

setLocation()
-------------
Place the marker into a new location in the map.  
This method triggers `options.onChange()` event.

*Arguments:*

1. location {google.maps.LatLng}

search()
-------------
Search address using Google's Geocoder service and display the results within the `options.resultsView`.  
This method triggers `options.onSearchStart()` and `options.onSearchEnd()` events.  
The map is disabled when the search is running.

See [Geocoder Usage Limits](https://developers.google.com/maps/documentation/geocoding/?hl=en#Limits).

*Arguments:*

1. address {String}

disable()
--------
Disable/enable the map.

*Arguments:*

1. disable {Boolean}

getMap()
--------
Get the current `google.maps.Map` object.
