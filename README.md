lightblocks.js
===========
lightblocks.js is a content-focused photo gallery using a horizontal masonry layout that automatically rescales in lightbox mode.

Visit [ericleong.github.io/lightblocks.js](http://ericleong.github.io/lightblocks.js) for a demo.

usage
-----
First, include `lightblocks.css` and `lightblocks.js` with your page.

Then, run `lightblocks.create()` after the images have loaded on the element that contains your images. Make sure to also add the `lightblocks` class to the element.

```JavaScript
window.onload = function() {
	lightblocks.create(document.getElementById('lightblocks'));
};
```

lightblocks.js will load a high resolution image from the url specified in the `data-highres` attribute.
