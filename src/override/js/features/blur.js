class Blur {
  constructor() {
    this.key = "blur";
    this.button = document.querySelector(".btn-blur")
    this.body = document.body;
    this.addEvent()
    this.init()
  }
  addEvent() {
    this.button.addEventListener( 'click', (e) => {
      this.button.classList.toggle('active')
      if (this.body.classList.contains("blur")) {
        this.disable()
      } else {
        this.enable()
      }
    });
  }
  setStorage(i){
    localStorage.setItem(this.key, i);
  }
  enable() {
    this.setStorage(1)
    this.body.classList.add('blur')
    this.button.classList.add('active')
  }
  disable(){
    this.setStorage(0)
    this.body.classList.remove('blur')
    this.button.classList.remove('active')
  }
  init() {
    let ls = localStorage.getItem(this.key);
    if (ls) {
      if (ls == 1) {
        this.enable()
      } else {
        this.disable()
      }
    } else {
      localStorage.setItem(this.key, 0);
    }
  }
}

let blurEnable = new Blur();
