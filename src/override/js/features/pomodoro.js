class Pomodoro {
  constructor() {
    this.storageKey = "pomodoro"
    this.button = document.querySelector(".btn-pomodoro")
    this.display = document.querySelector("#display-pomodoro")
    this.titleDisplay = document.querySelector("title")
    this.statusDisplay = document.querySelector("#status-pomodoro")
    this.icon = document.querySelector("#icon")
    this.sprint = 1500 // seconds
    this.current = 0
    this.timeout = null
    this.break = false
    this.breakTime = 300
    this.paused = true
    this.addEvents()
    this.loadState()
    this.init()
  }
  init() {
    this.showState()
    this.timeout = setTimeout(() => {
      if (!this.paused) {
        this.current = this.current + 1
        if (this.break) {
          if (this.current == this.breakTime) {
            this.current = 0
            this.break = false
          }
        } else {
          if (this.current == this.sprint) {
            this.current = 0
            this.break = true
          }
        }
        this.saveState()
      }
      this.showState()
      this.init()
    }, 1000)
  }
  addEvents() {
    this.button.addEventListener('click', (e) => {
      if (this.paused) {
        this.paused = false
      } else {
        this.paused = true
      }
      this.saveState()
      this.showState()
    })
  }
  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify({
      "current"  : this.current,
      "break" : this.break,
      "paused" : this.paused
    }))
  }
  loadState() {
    let ls = localStorage.getItem(this.storageKey)
    if (ls) {
      let state = JSON.parse(ls)
      this.current = state.current
      this.break = state.break,
      this.paused = state.paused
    }
  }
  showState() {
    this.display.innerText = this.current
    if (this.break) {
      this.titleDisplay.innerText = "Breaking: " + this.current
    } else {
      this.titleDisplay.innerText = "Working: " + this.current
    }
    if (this.paused) {
      this.statusDisplay.innerText = "Paused"
      this.icon.href = chrome.extension.getURL("images/stop.png")
    } else {
      this.statusDisplay.innerText = "Active"
      this.icon.href = chrome.extension.getURL("images/go.png")
    }
  }
}
const p = new Pomodoro()
