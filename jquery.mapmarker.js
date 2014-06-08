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
		'mapOptions': {
			'mapTypeId': google.maps.MapTypeId.ROADMAP,
			'zoom': 12
		},
		'markerOptions': {
			'draggable': true
		}
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

			// Element's data, to use with $().data();
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

			// Initialize objets and store in $().data()
			data.marker   = new google.maps.Marker(options.markerOptions);
			data.map      = new google.maps.Map(this.get(0), options.mapOptions);
			data.geocoder = new google.maps.Geocoder();
			this.data(data);

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
			this.data().marker.setPosition(location);
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
			var location = this.data().marker.getPosition();

			// Update fields, if they are defined.
			var latField = this.data().options.latField;
			var lngField = this.data().options.lngField;
			if (latField && lngField) {
				$(latField).val(location.lat());
				$(lngField).val(location.lng());
			}

			// Trigger onChange event.
			this.data().options.onChange.call(this, location);

			return this;
		},
		// - notifyNewLocation()
		
		/**
		 * Returns the reference to the google.maps.Map object
		 * @return {google.maps.Map}
		 */
		'getMap': function () {
			return this.data().map;
		}
		// - getMap()
	};

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