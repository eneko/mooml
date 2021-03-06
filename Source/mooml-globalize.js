﻿/*
---
script: mooml-globalize.js
version: 1.3.1
description: Mooml Globalize makes all template functions available in the global scope of the window object.
license: MIT-style
download: http://mootools.net/forge/p/mooml
source: http://github.com/eneko/mooml

authors:
- Eneko Alonso (http://enekoalonso.com)
- Ahmad Nassri (http://ahmadnassri.com)

provides:
- Window.div

requires:
- Mooml

...
*/

(function() {
    Window.implement(Mooml.engine.tags);
})()
