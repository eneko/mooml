

/**
* Mooml Globalize makes all template functions available in the global scope of the window object.
* This will polute the global scope creating a new function for every html tag supported by Mooml.
* It can be very handy for some small websites, but use with discrection.
*/
(function() {
	Native.implement([Window], Mooml.engine.tags);
})()
