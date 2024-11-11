# Dicecube

> a JavaScript module for dicing and shuffling images on HTML canvas

[Check out the demo page!][1]

[1]: https://www.rasch.co/dicecube/

## Install

```sh
npm i dicecube
```

## Quick Start

```html
<canvas class="dicecube"></canvas>
<script type="module">
import { Dicecube } from "./node_modules/dicecube/dicecube.js";

const canvas = document.querySelector("canvas.dicecube");

const cube = new Dicecube(canvas, {
  src: "https://picsum.photos/640/480?grayscale&random=1",
  gap: 1,
});

cube.init();
</script>
```

## API

### Options

```js
const cube = new Dicecube(canvas, {
  src: "https://picsum.photos/640/480?grayscale&random=1",
  width: 420,
  columns: 6,
  gap: 3,
  offsetX: 110,
  offsetY: 30,
});
```

- `src`: (string, default = "") path/url of image to load
- `width`: (number, default = 400) target canvas/image width in pixels
- `columns`: (number, default = 5) columns/rows for image grid
- `gap`: (number, default = 0) size of gaps in pixels
- `offsetX`: (number, default = 0) offset image horizontally in pixels
- `offsetY`: (number, default = 0) offset image vertically in pixels

### Properties

All of the options described above can also be modified dynamically on the
`Dicecube` object.

```js
cube.src = "https://picsum.photos/640/480?grayscale&random=1";
cube.width = 420;
cube.columns = 6;
cube.gap = 3;
cube.offsetX = 110;
cube.offsetY = 30;
```

- `Dicecube.src`: string
- `Dicecube.width`: number
- `Dicecube.columns`: number
- `Dicecube.gap`: number
- `Dicecube.offsetX`: number
- `Dicecube.offsetY`: number

There are a few properties that are automatically set by `Dicecube`, but are
available to modify directly.

- `Dicecube.positions`: (number[]) tracks the positions of each image tile
- `Dicecube.prev`: (number) tracks the previously selected tile
- `Dicecube.selected`: (number) tracks the currently selected tile

### Methods

- `Dicecube.resetPositions()`: resets `Dicecube.positions` to the default
  unshuffled order

- `Dicecube.updateCanvasSize()`: updates the canvas size to account for gaps
  and tile size

- `Dicecube.loadImage(src)`: loads image from src string path/url and returns a
  `Promise<void>`

- `Dicecube.draw()`: draws all of the image tiles to the canvas and updates the
  canvas size

- `Dicecube.render()`: wraps the `Dicecube.draw()` method in a
  `requestAnimationFrame`

- `Dicecube.init()`: a method that calls `Dicecube.loadImage(Dicecube.src)` and
  after the promise is resolved calls `Dicecube.render()`

- `Dicecube.clearCell(i)`: clears the canvas at the position of the number `i`
  cell

- `Dicecube.drawCell(i)`: draws the image tile for the number `i` cell

- `Dicecube.renderCell(i)`: wraps the `Dicecube.drawCell(i)` method in a
  `requestAnimationFrame`

- `Dicecube.swap()`: swaps the `Dicecube.selected` cell with one of its
  neighbors (up, down, left, right) but avoids swapping with `Dicecube.prev`
  cell

- `Dicecube.shuffle()`: shuffles the `Dicecube.positions` array
