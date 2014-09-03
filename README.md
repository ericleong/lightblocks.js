lightblocks.js
===========
lightblocks.js is a content-focused photo gallery using a horizontal masonry layout that automatically rescales in lightbox mode.

Visit [ericleong.github.io/lightblocks.js](http://ericleong.github.io/lightblocks.js) for a demo.

usage
-----
Simply run `lightblocks.create()` on the element that contains your images.

```JavaScript
window.onload = function() {
	lightblocks.create(document.getElementById('lightblocks'));
};
```

Include high resolution photos using the `data-highres` attribute of your `<img>` tags.