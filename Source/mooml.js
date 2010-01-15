/**
* @class Mooml
* @author Eneko Alonso (http://enekoalonso.com)
* Based on Ed Spencer's Jaml (http://edspencer.github.com/jaml)
* MooML is a Mootools based version of Jaml which makes HTML generation easy and pleasurable.
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
		return this.templates[name](data);
	},

	evaluate: function(code, data) {
		var elements = [];
		$splat(data || {}).each(function(params) {
			with (this.engine) {
				eval('(' + code + ')(params)');
			}
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
				//console.log('Rendering tag: ', tag);
				var el = new Element(tag);
				$A(arguments).each(function(argument, index) {
					//console.log('argument', index, ': ', argument, $type(argument));
					switch ($type(argument)) {
						case "array":
						case "element":
						case "collection": el.adopt(argument); break;
						case "string": el.appendText(argument); break;
						case "object": el.set(argument); break;
						default: throw ("MooML: Invalid argument:" + argument.toString());
					}
				});
				this.nodes.push(el);
				return el;
			}
		} .bind(this));
	}

}))();
