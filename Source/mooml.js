/*
---
script: mooml.js
description: Mooml is a Mootools based version of Jaml which makes HTML generation easy and pleasurable.
jaml: Mooml is based on Ed Spencer's Jaml (http://edspencer.github.com/jaml)
url: http://github.com/eneko/mooml
license: MIT-style

authors:
- Eneko Alonso (http://enekoalonso.com)

provides:
- mooml

requires:
- core/1.2.4:Class
- core/1.2.4:Elements
- core/1.2.4:Array

...
*/

Mooml = new (new Class({

	templates: {},
	engine: { nodeStack: [] },
	globalized: false,

	tags: [
		"html", "head", "body", "script", "meta", "title", "link", "script",
		"div", "p", "span", "a", "img", "br", "hr",
		"table", "tr", "th", "td", "thead", "tbody",
		"ul", "ol", "li",
		"dl", "dt", "dd",
		"h1", "h2", "h3", "h4", "h5", "h6", "h7",
		"form", "input", "label"
	],

	/**
	 * @constructor
	 * Initializes the engine
	 */
	initialize: function() {
		this.initEngine();
	},

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

		$splat(data || {}).each(function(params) {
			with (this.engine) eval('(' + code + ')(params)');
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
				if (!Mooml.globalized) var nodes = this.nodeStack.getLast();
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
							if (!Mooml.globalized) el.getChildren().each(function(child) { nodes.erase(child) });
							el.set('html', el.get('html') + argument);
							break;
						}
						case "object": {
							if (index == 0) el.set(argument);
							break;
						}
					}
				});

				if (!Mooml.globalized) nodes.push(el);
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

}))();
