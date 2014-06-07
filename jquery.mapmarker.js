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
		'latField': '',
		'lngField': '',
		'zoom': 12,
		'mapType': google.maps.MapTypeId.ROADMAP,
		'onChange': function (location) {}
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
				'location': null,
				'isSearching': false,
				'options': options
			};

			// Default location to place the marker
			var defaultLocation = new google.maps.LatLng(options.lat, options.lng);

			// Map options
			var mapOptions = {
				'center': defaultLocation,
				'zoom': options.zoom,
				'mapTypeId': options.mapType,

				// 'disableDefaultUI': true
			};

			// Marker options
			var markerOptions = {
				'draggable': true
			};

			// Initialize objets and store in $().data()
			data.marker   = new google.maps.Marker(markerOptions);
			data.map      = new google.maps.Map(this.get(0), mapOptions);
			data.geocoder = new google.maps.Geocoder();

			data.marker.setMap(data.map);
			this.data(data);

			// Place marker in default location
			this.mapMarker('setLocation', defaultLocation);

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
		 * Place marker in a new locaton and update location fields.
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
			var location = this.data().marker.getPosition();
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

	/**
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