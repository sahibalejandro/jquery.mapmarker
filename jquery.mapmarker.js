
/**
 * jQuery Map Marker v1.0.0
 * @author Sahib J. Leo (sahib.alejandro@gmail.com)
 * @license MIT
 */
(function ($) {
	/**
	 * Default options
	 * @type {Object}
	 */
	var defaultOptions = {
		'lat': 0,
		'lng': 0,
		'latField': null,
		'lngField': null,
		'onChange': function (location) {},
		'onSearchStart': function () {console.log('onSearchStart');},
		'onSearchEnd': function (status) {console.log('onSearchEnd');},
		'noResultsMsg': 'No results.',
		/**
		 * Map options.
		 * @see https://developers.google.com/maps/documentation/javascript/reference?hl=es#MapOptions
		 * @type {Object}
		 */
		'mapOptions': {
			'mapTypeId': google.maps.MapTypeId.ROADMAP,
			'zoom': 12
		},
		/**
		 * Marker options.
		 * @see https://developers.google.com/maps/documentation/javascript/reference?hl=es#MarkerOptions
		 * @type {Object}
		 */
		'markerOptions': {
			'draggable': true
		},
		/**
		 * Selector of element where the search results are displayed.
		 * @type {String}
		 */
		'resultsView': null,
		/**
		 * HTML template for each search result.
		 * @type {String}
		 */
		'resultTemplate': '<a href="#">:address</a>'
	};

	/**
	 * Plugin methods
	 * @type {Object}
	 */
	var m = {
		/**
		 * Initialize plugin on selected elements
		 * @param  {Object} opts Plugin options
		 * @return {jQuery}      jQuery object
		 */
		'init': function (opts) {
			// Save a reference to "this" to use it from within the callbacks
			var parent = this;

			// Extended options
			var options = $.extend({}, defaultOptions, opts);

			// Element's data, to use with $().data('mapMarker');
			var data = {
				'map': null,
				'marker': null,
				'geocoder': null,
				'options': options,
				
				'isSearching': false
			};

			// Get default location from fields or options object.
			var defaultLat = options.latField
				? $(options.latField).val() : options.lat;
			var defaultLng = options.lngField
				? $(options.lngField).val() : options.lng;

			// Create default location to center map and marker for the
			// first time.
			var defaultLocation = new google.maps.LatLng(defaultLat, defaultLng);

			/* ----------------------------------------------------------------
			 * Initialize objects
			 */

			// Initialize objets and store in $().data('mapMarker')
			data.marker   = new google.maps.Marker(options.markerOptions);
			data.map      = new google.maps.Map(this.get(0), options.mapOptions);
			data.geocoder = new google.maps.Geocoder();
			this.data('mapMarker', data);

			// Attach marker into map
			data.marker.setMap(data.map);

			// Center map and marker in default location
			data.map.setCenter(defaultLocation);
			this.mapMarker('setLocation', defaultLocation);

			/* ----------------------------------------------------------------
			 * Events
			 */

			// Place the marker in a new location when user click on the map.
			google.maps.event.addListener(data.map, 'click', function (e)
			{
				parent.mapMarker('setLocation', e.latLng);
			});

			// Notify new location when user stops dragging the marker
			google.maps.event.addListener(data.marker, 'dragend', function (e)
			{
				parent.mapMarker('notifyNewLocation');
			});
			
			return this;
		},
		// - init()
		
		/**
		 * Place marker in a new locaton and notify it.
		 * @param  {google.maps.LatLng} location New location
		 * @return {jQuery} jQuery object
		 */
		'setLocation': function (location) {
			this.data('mapMarker').marker.setPosition(location);
			this.mapMarker('notifyNewLocation');

			return this;
		},
		// - setLocation()
		
		/**
		 * Notify that the marker has a new location.
		 * @return {jQuery} jQuery object
		 */
		'notifyNewLocation': function () {
			// Get location from marker
			var location = this.data('mapMarker').marker.getPosition();

			// Update fields, if they are defined.
			var latField = this.data('mapMarker').options.latField;
			var lngField = this.data('mapMarker').options.lngField;
			if (latField && lngField) {
				$(latField).val(location.lat());
				$(lngField).val(location.lng());
			}

			// Trigger onChange event.
			this.data('mapMarker').options.onChange.call(this, location);

			return this;
		},
		// - notifyNewLocation()

		/**
		 * Perform a search using google.maps.Geocoder
		 * @param  {String} address Address to search
		 * @return {jQuery}         jQuery object
		 */
		'search': function (address) {
			// Keep reference for access from within callbacks.
			var parent = this;

			// Disable map when loading results.
			this.mapMarker('disable', true);

			// Trigger event "onSearchStart"
			this.data('mapMarker').options.onSearchStart.call(this);

			// Make request to geocode()
			this.data('mapMarker').geocoder.geocode({'address': address}, function (results, status) {

				// Enable map
				parent.mapMarker('disable', false);

				print_results.call(parent, results, status);

				// Trigger event "onSearchEnd"
				parent.data('mapMarker').options.onSearchEnd.call(this, status);
			});

			return this;
		},
		// - search()

		/**
		 * Disable/enable map, usefull for async tasks.
		 * @param  {boolean} disable Disable or enable
		 * @return {jQuery}          jQuery object
		 */
		'disable': function (disable) {

            if (disable) {
                var markerDisable = $('<div class="mapmarker-disable">').css({
                    'position': 'absolute',
                    'left': 0,
                    'top': 0,
                    'width': '100%',
                    'height': '100%',
                    'background-color': 'rgba(255,255,255,0.5)'
                });
                this.append(markerDisable);
            } else {
                this.find('.mapmarker-disable').remove();
            }

			return this;
		},
		// - disable()
		
		/**
		 * Returns the reference to the google.maps.Map object
		 * @return {google.maps.Map}
		 */
		'getMap': function () {
			return this.data('mapMarker').map;
		}
		// - getMap()
	};
	// - m{}

	/**
	 * Print geocoder results in resultsView.
	 */
	function print_results(results, status) {
		var parent   = this;
		var template = this.data('mapMarker').options.resultTemplate;
		var view     = $(this.data('mapMarker').options.resultsView);

		// Clear old results
		view.empty();

		switch (status) {
			case google.maps.GeocoderStatus.OK:
				// Iterate over results to print each one.
				$.each(results, function (i, result) {
					var resultHTML = template.replace(':address', result.formatted_address);
					var jqResult = $(resultHTML);

					jqResult.data('geocoderResult', result);
					jqResult.on('click', function (e) {
						e.preventDefault();
						var location = $(this).data().geocoderResult.geometry.location;
						parent.data('mapMarker').map.panTo(location);
						parent.mapMarker('setLocation', location);
					});

					view.append(jqResult);
				});
				break;
			default:
				view.text(status);
		}

	}

	/* ------------------------------------------------------------------------
	 * Method calling logic
	 */
	$.fn.mapMarker = function (method) {
		if (m[method]) {
			return m[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return m.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exists in jQuery.mapMarker');
		}
	}
})(jQuery);