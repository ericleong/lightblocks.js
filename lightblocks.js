/*
lightblocks.js

The MIT License (MIT)

Copyright (c) 2014 Eric Leong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var lightblocks = {

	create: function(blocks) {
		lightblocks.resize(blocks.children);

		blocks.classList.remove('loading');
		// shrink blocks if an empty space is clicked
		blocks.addEventListener('click', function() {
			if (this.children && this.children.length > 0) {
				lightblocks.shrink(this.children[0]);
			}
		});

		// add click listeners to blocks
		for (var i = 0; i < blocks.children.length; i++) {
			blocks.children[i].addEventListener('click', lightblocks.animate);
		}
	},

	resizeRow: function(row, width) {
		if (row && row.length > 1) {
			for (var i in row) {
				row[i].style.width = (row[i].getBoundingClientRect().width / width * 100) + '%';
				row[i].style.height = 'auto';
			}
		}
	},

	calcRowWidth: function(row) {
		var width = 0;

		for (var i in row) {
			width += row[i].getBoundingClientRect().width;
		}

		return width;
	},

	resize: function(blocks) {
		var row = [];
		var top = -1;

		for (var c = 0; c < blocks.length; c++) {
			var block = blocks[c];

			if (block) {
				if (top == -1) {
					top = block.getBoundingClientRect().top;
					
				} else if (block.getBoundingClientRect().top != top) {
					lightblocks.resizeRow(row, lightblocks.calcRowWidth(row));

					row = [];
					top = block.getBoundingClientRect().top;
				}

				row.push(block);
			}
		}

		lightblocks.resizeRow(row, lightblocks.calcRowWidth(row));
	},

	reset: function(block) {
		block.style.transform = 'translateX(0) scale(1)';
		block.style.webkitTransform = 'translateX(0) scale(1)';
		block.style.paddingTop = '0';
		block.classList.remove('active');
	},

	shrink: function(block) {
		block.parentNode.classList.remove('lightbox');

		// reset all blocks
		lightblocks.reset(block);

		var prev = block.previousElementSibling;
		while (prev) {
			lightblocks.reset(prev);
			prev = prev.previousElementSibling;
		}

		var next = block.nextElementSibling;
		while (next) {
			lightblocks.reset(next);
			next = next.nextElementSibling;
		}

		// swap images
		if (block.dataset.lowres) {
			block.src = block.dataset.lowres;
		}

		block.parentNode.style.paddingBottom = '0';
	},

	expand: function(block) {

		block.classList.add('active');
		block.parentNode.classList.add('lightbox');

		var parentWidth = block.parentNode.getBoundingClientRect().width;
		var blockRect = block.getBoundingClientRect();

		// swap images
		if (block.dataset.highres) {
			block.dataset.lowres = block.src;
			block.src = block.dataset.highres;
		}
		
		// determine what blocks are on this row and on the next row
		var row = [];
		row.push(block);

		var nextRow = [];
		var nextRowTop = -1;
		var next = block.nextElementSibling;

		while (next) {
			var nextTop = next.getBoundingClientRect().top;

			if (nextRowTop == -1 && nextTop != blockRect.top) {
				nextRow.push(next);
				nextRowTop = nextTop;
			} else if (nextRowTop != -1) {
				if (nextRowTop != nextTop) {
					break;
				} else {
					nextRow.push(next);
				}
			} else if (nextTop == blockRect.top) {
				row.push(next);
			}

			next = next.nextElementSibling;
		}

		var prev = block.previousElementSibling;

		while (prev) {
			if (prev.getBoundingClientRect().top == blockRect.top) {
				row.unshift(prev);
			} else {
				break;
			}

			prev = prev.previousElementSibling;
		}

		// expand row and shift row below
		var scale = window.innerHeight / blockRect.height;

		if (blockRect.width * scale > parentWidth) {
			scale = parentWidth / blockRect.width;
		}

		var offsetY = blockRect.height * (scale - 1); // next row's offset

		var offsetX = 0;  // shift in current row
		var prevWidth = 0;

		for (var i = 0; i < row.length; i++) {
			offsetX += prevWidth * scale;
			prevWidth = row[i].getBoundingClientRect().width;

			if (row[i] == block) {
				break;
			}
		}

		offsetX = parentWidth / 2 - blockRect.width * scale / 2 - offsetX;

		// transform row below
		var percentageOffsetY = (offsetY / parentWidth * 100) + '%';

		if (nextRow.length > 0) { // make sure there is a row below
			for (var i = 0; i < nextRow.length; i++) {
				nextRow[i].style.paddingTop = percentageOffsetY;
			}
		} else {
			// shift padding of the parent
			block.parentNode.style.paddingBottom = percentageOffsetY;
		}

		var itemOffset = 0; // offset due to scaling of previous items
		prevWidth = 0;

		// transform current row
		for (var i = 0; i < row.length; i++) {
			itemOffset += (prevWidth * scale - prevWidth);
			prevWidth = row[i].getBoundingClientRect().width;

			var percentageOffsetX = (itemOffset + offsetX) / prevWidth * 100;

			row[i].style.transform = 'translateX(' + percentageOffsetX.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
			row[i].style.webkitTransform = 'translateX(' + percentageOffsetX.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
		}
	},

	animate: function(e) {
		if (this.parentNode.classList.contains('lightbox')) {
			lightblocks.shrink(this);
		} else {
			lightblocks.expand(this);
		}

		e.stopPropagation();
	}
};