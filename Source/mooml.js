/*
---
description: Mooml is a Mootools based version of Jaml which makes HTML generation easy and pleasurable.
version: 1.0.3
url: http://github.com/eneko/mooml
Based on Ed Spencer's Jaml (http://edspencer.github.com/jaml)

license: MIT-style

authors:
- Eneko Alonso (http://enekoalonso.com)

requires:
- core/1.2.4:Class
- core/1.2.4:Elements
- core/1.2.4:Array

...
*/

Mooml = new (new Class({
	templates: {},
	engine: {
		nodes: []
	},
	tags: [
		"html", "head", "body", "script", "meta", "title", "link", "script",
		"div", "p", "span", "a", "img", "br", "hr",
		"table", "tr", "th", "td", "thead", "tbody",
		"ul", "ol", "li",
		"dl", "dt", "dd",
		"h1", "h2", "h3", "h4", "h5", "h6", "h7",
		"form", "input", "label"
	],

	initialize: function() {
		this.generateTags();
	},

	register: function(name, code) {
		this.templates[name] = function(data) {
			return this.evaluate(code, data);
		} .bind(this);
	},

	render: function(name, data) {
		//console.log('Mooml: rendering template: ', name);
		return this.templates[name](data);
	},

	evaluate: function(code, data) {
		var elements = [];
		$splat(data || {}).each(function(params) {
			with (this.engine) eval('(' + code + ')(params)');
			//console.log('Mooml: nodes:', this.engine.nodes);
			elements.extend(new Elements(this.engine.nodes.filter(function(node) {
				return node.parentNode === null;
			})));
			this.engine.nodes.length = 0;
		} .bind(this));
		return (elements.length > 1) ? elements : elements.shift();
	},

	generateTags: function() {
		this.tags.each(function(tag) {
			this.engine[tag] = function() {
				//console.log('Mooml: rendering tag: ', tag);
				var el = new Element(tag);
				$A(arguments).each(function(argument, index) {
					//console.log('Mooml: argument', index, ': ', argument, '(', $type(argument), ')');
					switch ($type(argument)) {
						case "array":
						case "element":
						case "collection": el.adopt(argument); break;
						case "string": el.appendText(argument); break;
						case "object": el.set(argument); break;
						default: return; // ignore
					}
				});
				this.nodes.push(el);
				return el;
			}
		} .bind(this));
	}

}))();
