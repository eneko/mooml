Mooml
===========

Mooml is a javascript templating engine that let's you build html from Javascript using a very nice and clean syntax taking advantage of the power of Mootools.
**Mooml creates the actual dom elements** in the template, returning a single element if the template has one root or an array of elements if there are multiple roots.

![Screenshot](http://github.com/eneko/mooml/raw/master/screenshot.jpg)

How to use
----------

Creating Mooml templates is very easy:

	Mooml.register('mytemplate', function() {
		div({id: 'mydivid'},
			h2('Title'),
			p('Lorem Ipsum'),
			p(a({ href: 'http://example.com' }, 'click here'))
		);
	});

Or as an alternative:

	var template = new Mooml.Template('mytemplate', function() {
		div({id: 'mydivid'},
			h2('Title'),
			p('Lorem Ipsum'),
			p(a({ href: 'http://example.com' }, 'click here'))
		);
	});

Both of the avobe templates will generate the following HTML structure, creating the dom elements for you. The first method will register the template globally while the second one wont.:

	<div id="mydivid">
		<h2>Title</h2>
		<p>Lorem Ipsum</p>
		<p><a href="http://example.com">click here</a></p>
	</div>

To render the template and generate the dom elements:

	var el = Mooml.render('mytemplate');
	var el = template.render();

Passing variables to a template can be done easily too:

	Mooml.register('mytemplate', function(params) {
		div({id: params.myDivId}
			// more code here
		);
	});
	var el = Mooml.render('mytemplate', { myDivId: 'newid' });


Rendering template arrays
-----------------

Mooml allows rendering template arrays. This is, if we pass an array of data to the render function, it will render the template N times.
This is very useful when rendering list elements, table rows, or any other repetitive html layout:

	var elements = Mooml.render('mytemplate', [
		{ myDivId: 'div1' },
		{ myDivId: 'div2' },
		{ myDivId: 'div3' }
	]);

Will generate:

	<div id="div1"></div>
	<div id="div2"></div>
	<div id="div3"></div>


Evaluating templates on the fly
-----------------

Evaluating templates on the fly can be done by creating a template with the Mooml.Template constructor, although the evaluate step is redundant since the template it self contains a render function:

	var template = new Mooml.Template('mytemplate', function() {
		div('Template on the fly');
	});
	// Both of these calls return the same result:
	Mooml.evaluate(template); // returns <div>Template on the fly</div>
	template.render(); // returns <div>Template on the fly</div>


Globalizing Mooml
-----------------

Since version 1.1, if you whish to globalize Mooml you need to download and include mooml-globalize.js in your project, after including mooml.js.
This will make all Mooml engine template tag functions available at the window scope.

With mooml-globalize.js we can do this:

	var mydiv = div(options); // Same options as Mootools new Element()

Mooml globalized functions can also have nested elements, which makes very easy to create dom elements:

	var mydiv = div(options, 
		p('First paragraph'),
		p('Second paragraph'),
		div('Nested div:',
			span('div content')
		),
		Mooml.render('nested_template'),
		'Some <b>inline</b> <em>html</em> too'
	);

Please be aware that using Mooml globalized feature will pollute the window object scope, overriding any methods with the same name and/or possibly conflicting with other javascript libraries.


Do not want to globalize? Still can run Mooml inline
-----------------

Mooml can be used directly inline to create dom elements:

	var mydiv = Mooml.engine.tags.div({id:'mydiv'}, 'Inline div');

Better yet, you can build elements with children like this:

	var el;
	with (Mooml.engine.tags) {
		el = div({id:'mydiv',
			p('one paragraph'),
			p('another paragraph'),
			input({name:'email', type:'text', defaultValue:'test@example.com'})
		);
	}


Differences between Mooml and Jaml
-----------------

Mooml is based in Jaml, but it has some differences:

* Mooml code takes advantage of Mootools using classes, elements, etc
* Mooml does not return text as Jaml. Instead, it creates the dom elements in the template
* Mooml alows passing css in json format and events, like Mootools Element.set function does

