/*
---
description: Mooml is a Mootools based version of Jaml which makes HTML generation easy and pleasurable.
version: 1.0.6
url: http://github.com/eneko/mooml
jaml: Mooml is based on Ed Spencer's Jaml (http://edspencer.github.com/jaml)

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
	engine: {
		nodeStack: []
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
		this.initEngine();
	},

	register: function(name, code) {
		this.templates[name] = function(data) {
			return this.evaluate(code, data);
		} .bind(this);
	},

	render: function(name, data) {
		return this.templates[name](data);
	},

	evaluate: function(code, data) {
		var elements = [];
		var nodes = [];
		this.engine.nodeStack.push(nodes);

		$splat(data || {}).each(function(params) {
			with (this.engine) eval('(' + code + ')(params)');
			//console.log('Mooml: nodes:', nodes, nodes.length, this.engine.nodeStack.length);
			elements.extend(new Elements(nodes.filter(function(node) {
				return node.parentNode === null;
			})));
			nodes.empty();
		} .bind(this));

		this.engine.nodeStack.pop();
		return (elements.length > 1) ? elements : elements.shift();
	},

	initEngine: function() {
		this.tags.each(function(tag) {
			if (this.engine[tag]) return;
			this.engine[tag] = function() {
				//console.log('Mooml: rendering tag: ', tag);
				var nodes = this.nodeStack.getLast();
				var el = new Element(tag);
				$each(arguments, function(argument, index) {
					//console.log('Mooml: argument', index, ': ', argument, '(', $type(argument), ')');
					switch ($type(argument)) {
						case "array":
						case "element":
						case "collection": el.adopt(argument); break;
						case "string": {
							el.getChildren().each(function(child) { nodes.erase(child) });
							el.set('html', el.get('html') + argument);
							break;
						}
						case "object": el.set(argument); break;
						default: return; // ignore
					}
				});
				nodes.push(el);
				return el;
			}
		}.bind(this));
	}

}))();
