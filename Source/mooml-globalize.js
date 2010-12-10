/*
---
script: mooml-globalize.js
version: 1.3.0
description: Mooml Globalize makes all template functions available in the global scope of the window object.
license: MIT-style
download: http://mootools.net/forge/p/mooml
source: http://github.com/eneko/mooml

authors:
- Eneko Alonso (http://enekoalonso.com)

provides:
- Window.div

requires:
- Mooml

...
*/

(function() {
	Native.implement([Window], Mooml.engine.tags);
})()
