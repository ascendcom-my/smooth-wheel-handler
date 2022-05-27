class Wheel {
  constructor({ full_progress, callback, threshold }) {
    this.progress = 0
    this.full_progress = full_progress || 10000
    this.scroll_buffer = 0
    this.start = 0
    this.callback = callback
    this.threshold = threshold || 5
    this.releaseBuffer = this.releaseBuffer.bind(this)
    this.releaseBuffer()
  }

  releaseBuffer(timestamp) {
    let delta = timestamp - this.start
    this.start = timestamp
    if (Math.abs(this.scroll_buffer / delta) > 10) {
      delta *= 3
    }
    if (this.scroll_buffer !== 0) {
      if (this.scroll_buffer > 0) {
        this.scroll_buffer -= delta
        if (this.scroll_buffer < 0) this.scroll_buffer = 0
        this._callback(this.progress + delta)
      }
      if (this.scroll_buffer < 0) {
        this.scroll_buffer += delta
        if (this.scroll_buffer > 0) this.scroll_buffer = 0
        this._callback(this.progress - delta)
      }
    }
    window.requestAnimationFrame(this.releaseBuffer)
  }

  _callback(target) {
    if (target < 0) {
      target = 0
    }
    if (target > this.full_progress) {
      target = this.full_progress
    }
    this.progress = target

    this.callback({
      current: this.progress,
      percentage: (this.progress / this.full_progress) * 100,
    })
  }

  handle(deltaY) {
    if (Math.abs(deltaY) > this.threshold) {
      this.scroll_buffer += deltaY
    } else {
      this._callback(this.progress + deltaY)
    }
  }
}

export default Wheel
