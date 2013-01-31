Mooml
===========

Mooml is a javascript templating engine that lets you build html from Javascript using a very nice and clean syntax taking advantage of the power of Mootools.
**Mooml creates the actual dom elements** in the template, returning a single element if the template has one root or an array of elements if there are multiple roots.

Templates can be defined in multiple ways:

* global templates with Mooml.register()
* local templates inside a class instance with this.registerTemplate()
* on the fly with new Mooml.Template
* embeded in the HTML DOM as <script type="text/mooml">

![Screenshot](http://github.com/eneko/mooml/raw/master/screenshot.jpg)

How to use
----------

Creating Mooml templates is very easy:

```javascript
Mooml.register('mytemplate', function() {
    div({id: 'mydivid'},
        h2('Title'),
        p('Lorem Ipsum'),
        p(a({ href: 'http://example.com' }, 'click here'))
    );
});
```

On the fly:

```javascript
var template = new Mooml.Template('mytemplate', function() {
    div({id: 'mydivid'},
        h2('Title'),
        p('Lorem Ipsum'),
        p(a({ href: 'http://example.com' }, 'click here'))
    );
});
```

In the DOM:

```html
<script type="text/mooml" name="mytemplate">
    div({id: 'mydivid'},
        h2('Title'),
        p('Lorem Ipsum'),
        p(a({ href: 'http://example.com' }, 'click here'))
    );
</script>
```

All of the above templates will generate the following HTML structure, creating the dom elements for you. The first and third methods will register the template globally while the second one wont:

```html
<div id="mydivid">
    <h2>Title</h2>
    <p>Lorem Ipsum</p>
    <p><a href="http://example.com">click here</a></p>
</div>
```

To render the template and generate the dom elements:

```javascript
var el = Mooml.render('mytemplate');
var el = template.render();
```

Passing variables to a template can be done easily too:

```javascript
Mooml.register('mytemplate', function(params) {
    div({id: params.myDivId}
        // more code here
    );
});
var el = Mooml.render('mytemplate', { myDivId: 'newid' });
```

DOM defined templates have the default parameters data & index, so it's equivalent to:

```javascript
Mooml.register('mytemplate', function(data, index) {
    // template code
});
```

Rendering template arrays
-----------------

Mooml allows rendering template arrays. This is, if we pass an array of data to the render function, it will render the template N times.
This is very useful when rendering list elements, table rows, or any other repetitive html layout:

```javascript
var elements = Mooml.render('mytemplate', [
    { myDivId: 'div1' },
    { myDivId: 'div2' },
    { myDivId: 'div3' }
]);
```

Will generate:

```html
<div id="div1"></div>
<div id="div2"></div>
<div id="div3"></div>
```

Evaluating templates on the fly
-----------------

Evaluating templates on the fly can be done by creating a template with the Mooml.Template constructor, although the evaluate step is redundant since the template it self contains a render function:

```javascript
var template = new Mooml.Template('mytemplate', function() {
    div('Template on the fly');
});
// Both of these calls return the same result:
Mooml.evaluate(template); // returns <div>Template on the fly</div>
template.render(); // returns <div>Template on the fly</div>
```

Globalizing Mooml
-----------------

Since version 1.1, if you wish to globalize Mooml you need to download and include mooml-globalize.js in your project, after including mooml.js.
This will make all Mooml engine template tag functions available at the window scope.

With mooml-globalize.js we can do this:

```javascript
var mydiv = div(options); // Same options as Mootools new Element()
```

Mooml globalized functions can also have nested elements, which makes very easy to create dom elements:

```javascript
var mydiv = div(options, 
    p('First paragraph'),
    p('Second paragraph'),
    div('Nested div:',
        span('div content')
    ),
    Mooml.render('nested_template'),
    'Some <b>inline</b> <em>html</em> too'
);
```

Please be aware that using Mooml globalized feature will pollute the window object scope, overriding any methods with the same name and/or possibly conflicting with other javascript libraries.


Do not want to globalize? Still can run Mooml inline
-----------------

Mooml can be used directly inline to create dom elements:

```javascript
var mydiv = Mooml.engine.tags.div({id:'mydiv'}, 'Inline div');
```

Better yet, you can build elements with children like this:

```javascript
var el;
with (Mooml.engine.tags) {
    el = div({id:'mydiv',
        p('one paragraph'),
        p('another paragraph'),
        input({name:'email', type:'text', defaultValue:'test@example.com'})
    );
}
```

Differences between Mooml and Jaml
-----------------

Mooml is based in Jaml, but it has some differences:

* Mooml code takes advantage of Mootools using classes, elements, etc
* Mooml does not return text as Jaml. Instead, it creates the dom elements in the template
* Mooml alows passing css in json format and events, like Mootools Element.set function does

