import { Dicecube } from "./dicecube.js"

// ---------------------------------------
// Initialize Dicecube
// ---------------------------------------

/** @type {HTMLCanvasElement | null} */
const canvas = document.querySelector("canvas.dicecube")

if (!canvas) throw new Error("Canvas not found")

const cube = new Dicecube(canvas, {
  src: "https://picsum.photos/400?grayscale&random=1",
  gap: 1,
})

cube.init()

// ---------------------------------------
// Slideshow
// ---------------------------------------

let index = 1

// cache the next image
const cache = new Image()
cache.src = `https://picsum.photos/640/480?grayscale&random=${index + 1}`

const prev = document.querySelector("#prev")
const next = document.querySelector("#next")

/** @param {Dicecube} cube */
const spiralTransition = cube => {
  cube.positions.forEach(p => {
    const distanceToCenter = Math.abs(p - Math.floor(cube.positions.length / 2))
    const interval = 64 - cube.columns * 2

    setTimeout(() => { cube.renderCell(p) }, distanceToCenter * interval)
  })
}

prev?.addEventListener("click", () => {
  cube.loadImage(`https://picsum.photos/640/480?grayscale&random=${--index}`)
  .then(() => {
    spiralTransition(cube)
  })
})

next?.addEventListener("click", () => {
  cube.loadImage(`https://picsum.photos/640/480?grayscale&random=${++index}`)
  .then(() => {
    cache.src = `https://picsum.photos/640/480?grayscale&random=${index + 1}`
    spiralTransition(cube)
  })
})

// ---------------------------------------
// Columns Range Input
// ---------------------------------------

/** @type {HTMLInputElement | null} */
const columnsSlider = document.querySelector("#columns")
const columnsValue = document.querySelector("#columns-value")

columnsSlider?.addEventListener("change", async () => {
  if (columnsValue !== null) {
    columnsValue.innerHTML = columnsSlider.value + " columns"
  }

  cube.columns = parseInt(columnsSlider.value)
  cube.resetPositions()
  cube.render()
})

// ---------------------------------------
// Gaps Range Input
// ---------------------------------------

/** @type {HTMLInputElement | null} */
const gapSlider = document.querySelector("#gap")
const gapValue = document.querySelector("#gap-value")

gapSlider?.addEventListener("change", () => {
  if (gapValue !== null) {
    gapValue.innerHTML = gapSlider.value + "px gaps"
  }

  cube.gap = parseInt(gapSlider.value)
  cube.render()
})

// ---------------------------------------
// Shuffling
// ---------------------------------------

let shuffled = false

canvas.addEventListener("click", () => {
  if (shuffled) {
    cube.resetPositions()
    spiralTransition(cube)
  } else {
    cube.shuffle()
    spiralTransition(cube)
  }

  shuffled = !shuffled
})
