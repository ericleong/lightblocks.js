lightblocks.js
===========
lightblocks.js is a content-focused photo gallery using a horizontal masonry layout that automatically rescales in lightbox mode.

Visit [ericleong.github.io/lightblocks.js](http://ericleong.github.io/lightblocks.js) for a demo.

usage
-----
First, include `lightblocks.css` and `lightblocks.js` with your page.

Then, run `lightblocks.create()` after on the element that contains your images. Make sure to also add the `lightblocks` class to the element, and to only run `create()` after the images have loaded.

```JavaScript
window.onload = function() {
	lightblocks.create(document.getElementById('lightblocks'));
};
```

A high resolution image will be loaded in lightbox mode from the url specified in the `data-highres` attribute.
```HTML
<img src="//mysite.com/awesome.jpg" data-highres="//mysite.com/awesomer.jpg" />
```
