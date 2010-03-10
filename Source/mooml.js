/*
---
script: mooml.js
version: 1.0.13
description: Mooml is a javasctript templating engine for HTML generation, powered by Mootools.
license: MIT-style
download: http://mootools.net/forge/p/mooml
source: http://github.com/eneko/mooml
htmltags: http://www.w3schools.com/html5/html5_reference.asp
credits: Mooml is based on Ed Spencer's Jaml (http://edspencer.github.com/jaml)

authors:
- Eneko Alonso (http://enekoalonso.com)

provides:
- Mooml

requires:
- core/1.2.4:Class
- core/1.2.4:Elements
- core/1.2.4:Array

...
*/

Mooml = {

	templates: {},
	engine: { nodeStack: [] },
	globalized: false,

	tags: [
		"a", "abbr", "address", "area", "article", "aside", "audio",
		"b", "base", "bdo", "blockquote", "body", "br", "button",
		"canvas", "caption", "cite", "col", "colgroup", "command",
		"datalist", "dd", "del", "details", "dialog", "dfn", "div", "dl", "dt",
		"em", "embed",
		"fieldset", "figure",
		"footer", "form",
		"h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html",
		"i", "iframe", "img", "input", "ins",
		"keygen", "kbd",
		"label", "legend", "li", "link",
		"map", "mark", "menu", "meta", "meter",
		"nav", "noscript",
		"object", "ol", "optgroup", "option", "output",
		"p", "param", "pre", "progress",
		"q",
		"rp", "rt", "ruby",
		"samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "sup",
		"table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr",
		"ul",
		"var", "video",
		// Deprecated in HTML 5
		"acronym", "applet", "basefont", "big", "center", "dir", "font", "frame", "frameset", "noframes", "s", "strike", "tt", "u", "xmp"
		// Not supported tags
		// "code"
	],

	/**
	 * Registers a new template for later use
	 * @param {String} name The name of the template
	 * @param {Function} code The code function of the template
	 */
	register: function(name, code) {
		this.templates[name] = function(data) {
			return this.evaluate(code, data);
		}.bind(this);
	},

	/**
	 * Evaluates a registered template
	 * @param {String} name The name of the template to evaluate
	 * @param {Object|Array} data Optional data object or array of objects
	 */
	render: function(name, data) {
		return this.templates[name](data);
	},

	/**
	 * Evaluates a Mooml template
	 * @param {function} code The code function of the template
	 * @param {Object|Array} data Optional data object or array of objects
	 */
	evaluate: function(code, data) {
		var elements = [];
		var nodes = [];
		this.engine.nodeStack.push(nodes);

		$splat(data || {}).each(function(params, index) {
			with (this.engine) eval('(' + code + ')(params, index)');
			elements.extend(new Elements(nodes.filter(function(node) {
				return node.getParent() === null;
			})));
			nodes.empty();
		}.bind(this));

		this.engine.nodeStack.pop();
		return (elements.length > 1) ? elements : elements.shift();
	},

	/**
	 * Initializes the engine generating a javascript function for every html
	 * tag that can be used on the template.
	 * Template tag functions can receive options for the element, child 
	 * elements and html code as parameters.
	 * initEngine can be called by the user in case of adding additional tags.
	 */
	initEngine: function() {
		this.tags.each(function(tag) {
			var owner = (this.globalized) ? window : this.engine;
			owner[tag] = function() {
				var nodes = (Mooml.globalized)? null : this.nodeStack.getLast();
				var el = new Element(tag);

				$each(arguments, function(argument, index) {
					switch ($type(argument)) {
						case "array":
						case "element":
						case "collection": {
							el.adopt(argument);
							break;
						}
						case "string": {
							if (!Mooml.globalized && nodes) {
								el.getChildren().each(function(child) { nodes.erase(child) });
							}
							el.set('html', el.get('html') + argument);
							break;
						}
						case "number": {
							el.appendText(argument.toString());
							break;
						}
						case "object": {
							if (index == 0) el.set(argument);
							break;
						}
					}
				});

				if (!Mooml.globalized && nodes) nodes.push(el);
				return el;
			}
		}.bind(this));
	},

	/**
	 * Makes all template functions available in the global scope of the window object.
	 * This will polute the global scope creating a new function for every html tag.
	 * Can be very handy for some websites. Use with discrection.
	 */
	globalize: function() {
		this.globalized = true;
		this.initEngine();
	}

}

Mooml.initEngine();
