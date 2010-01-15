Mooml
===========

Mooml is a port of Jaml. It let's you build html from Javascript using a very nice and clean templating system.
NOTE: *Mooml creates the dom elements* for you, returning a single element if the template has one root or an array of elements if there are multiple roots.

How to use
----------

Creating Mooml templates is very easy:

	Mooml.register('mytemplate', function() {
		div({id: 'mydivid'},
			h2('Title'),
			p('Lorem Ipsum'),
			p(
				a({ href: 'http://example.com' }, 'click here')
			)
		);
	});

This template will generate the following HTML structure, creating the dom elements for you:

	<div id="mydivid">
		<h2>Title</h2>
		<p>Lorem Ipsum</p>
		<p><a href="http://example.com">click here</a></p>
	</div>

To render the template and generate the dom elements:

	var el = Mooml.render('mytemplate');

Passing variables to a template can be done easily too:

	Mooml.register('mytemplate', function(params) {
		div({id: params.myDivId}
			// more code here
		);
	});
	var el = Mooml.render('mytemplate', { myDivId: 'newid' });

Finally, we can render a template N times by passing an array as argument to the render method:

	var elements = Mooml.render('mytemplate', [
		{ myDivId: 'div1' },
		{ myDivId: 'div2' },
		{ myDivId: 'div3' }
	]);

Will generate:

	<div id="div1">
	</div>
	<div id="div2">
	</div>
	<div id="div3">
	</div>


Differences between Mooml and Jaml
-----------------

Mooml is based in Jaml, but it has some differences:

* Mooml code takes advantage of Mootools using classes, elements, etc
* Mooml does not return text as Jaml. Instead, it creates the dom elements in the template
* Mooml alows passing css in json format and events, like Mootools Element.set function does

