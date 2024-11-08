/**
 * @typedef {Object} Options
 * @property {string} [src]
 * @property {number} [width]
 * @property {number} [columns]
 * @property {number} [gap]
 * @property {number} [offsetX]
 * @property {number} [offsetY]
 */

export class Dicecube {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Options} [options]
   */
  constructor(canvas, options) {
    this.src = options?.src ?? ""
    this.width = options?.width ?? 400
    this.columns = options?.columns ?? 5
    this.gap = options?.gap ?? 0
    this.offsetX = options?.offsetX ?? 0
    this.offsetY = options?.offsetY ?? 0

    this.img = new Image()
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")

    this.updateCanvasSize()

    this.positions = [0]
    this.prev = 0
    this.selected = 0

    this.resetPositions()
  }

  resetPositions() {
    this.positions = Array.from({ length: this.columns ** 2 }, (_, i) => i)
    this.selected = this.prev = this.positions.length - 1
  }

  updateCanvasSize() {
    this.canvas.width = (this.columns - 1) * this.gap + this.width
    this.canvas.height = this.canvas.width
  }

  /**
   * @param {string} src
   * @returns {Promise<void>}
   */
  loadImage(src) {
    return new Promise((resolve, reject) => {
      this.img.addEventListener("load", () => resolve())
      this.img.addEventListener("error", e => reject(e))
      this.img.src = src
    })
  }

  /**
   * @param {number} i
   * @param {boolean} dest
   * @returns {[number, number, number, number]}
   */
  #cell(i, dest = false) {
    const size = Math.floor(this.width / this.columns)
    const col = Math.floor(i / this.columns)
    const row = i % this.columns
    const x = dest ? row * (this.gap + size) : row * size + this.offsetX
    const y = dest ? col * (this.gap + size) : col * size + this.offsetY

    return [x, y, size, size]
  }

  draw = () => {
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.updateCanvasSize()
    this.positions.forEach((pos, i) => {
      this.ctx?.drawImage(this.img, ...this.#cell(i), ...this.#cell(pos, true))
    })
  }

  render = () => requestAnimationFrame(this.draw)

  init = () => this.loadImage(this.src).then(this.render)

  /** @param {number} i */
  clearCell = i => this.ctx?.clearRect(...this.#cell(i, true))

  /** @param {number} i */
  drawCell = i => {
    this.ctx?.drawImage(
      this.img,
      ...this.#cell(i),
      ...this.#cell(this.positions[i] ?? i, true),
    )
  }

  /** @param {number} i */
  renderCell(i) {
    requestAnimationFrame(() => this.drawCell(i))
  }

  swap() {
    const moves = [-this.columns, -1, 1, this.columns].reduce(
      /** @param {number[]} moves */ (moves, move) => {
        const next = this.selected + move

        return next < 0 ||
          next >= this.columns ** 2 ||
          (move === -1 && next % this.columns === this.columns - 1) ||
          (move === 1 && next % this.columns === 0) ||
          next === this.prev
          ? moves
          : [...moves, next]
      },
      [],
    )

    const next = moves[Math.floor(Math.random() * moves.length)]
    const i = this.positions.findIndex(i => i === this.selected)
    const j = this.positions.findIndex(i => i === next)

    this.prev = this.selected
    if (next !== undefined) this.selected = next

    if (this.positions[i] !== undefined && this.positions[j] !== undefined) {
      ;[this.positions[i], this.positions[j]] = [
        this.positions[j],
        this.positions[i],
      ]
    }
  }

  shuffle() {
    this.positions.forEach((_, i) => {
      const j = Math.floor(Math.random() * this.positions.length)

      if (
        i !== j &&
        this.positions[i] !== undefined &&
        this.positions[j] !== undefined
      ) {
        ;[this.positions[i], this.positions[j]] = [
          this.positions[j],
          this.positions[i],
        ]
      }
    })
  }
}
